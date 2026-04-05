import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Booking, Room, Hotel, Guest, RoomType, Staff } from '../types';
import { bookingService, roomService, paymentService, systemService } from '../lib/api';

export interface CleaningAssignment {
  room_id: number;
  staff_id: number;
  status: 'pending' | 'in-progress' | 'completed';
  assigned_at: string;
  completed_at?: string;
}

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
  hotels: Hotel[];
  guests: Guest[];
  roomTypes: RoomType[];
  staff: Staff[];
  cleaningAssignments: CleaningAssignment[];
  updateBookingStatus: (bookingId: number, newStatus: Booking['booking_status']) => void;
  updateBookingNotes: (bookingId: number, notes: string) => void;
  updateRoomStatus: (roomId: number, newStatus: Room['status']) => void;
  assignCleaningTask: (roomId: number, taskType?: 'cleaning' | 'maintenance') => void;
  completeCleaningTask: (roomId: number) => void;
  confirmedCount: number;
  checkedInCount: number;
  checkedOutCount: number;
  availableRoomsCount: number;
  occupiedRoomsCount: number;
  refreshData: () => Promise<void>;
  createBooking: (data: any) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  confirmCheckIn: (bookingId: number, paymentData?: any, notes?: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Global cache to prevent strict mode or rapid navigation from firing duplicate API requests
let globalCache: {
  bookings: Booking[];
  rooms: Room[];
  hotels: Hotel[];
  guests: Guest[];
  roomTypes: RoomType[];
  staff: Staff[];
  lastFetch: number;
} | null = null;
let fetchPromise: Promise<void> | null = null;
const CACHE_TTL = 30000;

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(globalCache?.bookings || []);
  const [rooms, setRooms] = useState<Room[]>(globalCache?.rooms || []);
  const [hotels, setHotels] = useState<Hotel[]>(globalCache?.hotels || []);
  const [guests, setGuests] = useState<Guest[]>(globalCache?.guests || []);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(globalCache?.roomTypes || []);
  const [staff, setStaff] = useState<Staff[]>(globalCache?.staff || []);
  const [cleaningAssignments, setCleaningAssignments] = useState<CleaningAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(!globalCache);

  const fetchData = useCallback(async (force = false) => {
    if (!force && globalCache && Date.now() - globalCache.lastFetch < CACHE_TTL) {
      setBookings(globalCache.bookings);
      setRooms(globalCache.rooms);
      setHotels(globalCache.hotels);
      setGuests(globalCache.guests);
      setRoomTypes(globalCache.roomTypes);
      setStaff(globalCache.staff);
      setIsLoading(false);
      return;
    }

    if (fetchPromise && !force) {
      await fetchPromise;
      if (globalCache) {
        setBookings(globalCache.bookings);
        setRooms(globalCache.rooms);
        setHotels(globalCache.hotels);
        setGuests(globalCache.guests);
        setRoomTypes(globalCache.roomTypes);
        setStaff(globalCache.staff);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fetchPromise = (async () => {
      try {
        const res = await systemService.init();

        if (res.success && res.data) {
          const newCache = {
            bookings: res.data.bookings || [],
            rooms: res.data.rooms || [],
            hotels: res.data.hotels || [],
            guests: res.data.guests || [],
            roomTypes: res.data.roomTypes || [],
            staff: res.data.staff || [],
            lastFetch: Date.now(),
          };

          globalCache = newCache;

          setBookings(newCache.bookings);
          setRooms(newCache.rooms);
          setHotels(newCache.hotels);
          setGuests(newCache.guests);
          setRoomTypes(newCache.roomTypes);
          setStaff(newCache.staff);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        fetchPromise = null;
      }
    })();

    await fetchPromise;
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized computed counts — recalculate only when source data changes
  const confirmedCount = useMemo(
    () => bookings.filter(b => b.booking_status === 'confirmed').length,
    [bookings]
  );

  const checkedInCount = useMemo(
    () => bookings.filter(b => b.booking_status === 'checked-in').length,
    [bookings]
  );

  const checkedOutCount = useMemo(
    () => bookings.filter(b => b.booking_status === 'checked-out').length,
    [bookings]
  );

  const availableRoomsCount = useMemo(
    () => rooms.filter(r => r.status === 'available').length,
    [rooms]
  );

  const occupiedRoomsCount = useMemo(
    () => rooms.filter(r => r.status === 'occupied').length,
    [rooms]
  );

  const createBooking = useCallback(async (data: any) => {
    try {
      const response = await bookingService.create(data);
      if (response.success && response.data) {
        await fetchData();
        return { success: true, data: response.data };
      }

      let errorMessage = response.error || 'Failed to create booking';
      if (response.errors) {
        errorMessage = Object.values(response.errors).join(', ');
      }
      return { success: false, error: errorMessage };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [fetchData]);

  const confirmCheckIn = useCallback(async (bookingId: number, paymentData?: any, notes?: string) => {
    setIsLoading(true);
    try {
      const statusRes = await bookingService.updateStatus(bookingId, 'checked-in');

      if (!statusRes.success) {
        return { success: false, error: statusRes.error || 'Failed to update booking status' };
      }

      // Update notes and payment in parallel if both provided
      const promises: Promise<any>[] = [];

      if (notes) {
        promises.push(bookingService.update(bookingId, { notes } as any));
      }

      if (paymentData) {
        promises.push(paymentService.create({
          booking_id: bookingId,
          ...paymentData,
          status: 'completed',
          payment_date: new Date().toISOString(),
        }));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      await fetchData();
      return { success: true };
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, error: 'An unexpected error occurred during check-in' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const updateBookingStatus = useCallback(async (bookingId: number, newStatus: Booking['booking_status']) => {
    // Optimistic update
    setBookings(prev =>
      prev.map(b =>
        b.booking_id === bookingId
          ? { ...b, booking_status: newStatus, modified_at: new Date().toISOString() }
          : b
      )
    );

    const response = await bookingService.updateStatus(bookingId, newStatus);
    if (response.success) {
      const roomsRes = await roomService.getBy();
      if (roomsRes.success && roomsRes.data) {
        setRooms(roomsRes.data);
      }
    }
  }, []);

  const updateBookingNotes = useCallback(async (bookingId: number, notes: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.booking_id === bookingId
          ? { ...b, notes, modified_at: new Date().toISOString() }
          : b
      )
    );

    await bookingService.update(bookingId, { notes } as any);
  }, []);

  const assignCleaningTask = useCallback((roomId: number, taskType: 'cleaning' | 'maintenance' = 'cleaning') => {
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) return;

    const availableStaff = staff.find(s => {
      const r = (s.role || (s as any).position || '').toLowerCase();

      const roleMatch = taskType === 'cleaning'
        ? (r === 'housekeeping' || r === 'cleaner')
        : (r === 'maintenance');

      return s.hotel_id === room.hotel_id &&
        roleMatch &&
        !cleaningAssignments.some(ca => ca.staff_id === s.id && ca.status !== 'completed');
    });

    if (availableStaff) {
      const newAssignment: CleaningAssignment = {
        room_id: roomId,
        staff_id: availableStaff.id,
        status: 'pending',
        assigned_at: new Date().toISOString(),
      };
      setCleaningAssignments(prev => [...prev, newAssignment]);
    }
  }, [rooms, staff, cleaningAssignments]);

  const updateRoomStatus = useCallback(async (roomId: number, newStatus: Room['status']) => {
    setRooms(prev =>
      prev.map(r =>
        r.room_id === roomId
          ? { ...r, status: newStatus }
          : r
      )
    );

    await roomService.updateStatus(roomId, newStatus);

    if (newStatus === 'cleaning' || newStatus === 'maintenance') {
      assignCleaningTask(roomId, newStatus);
    }
  }, [assignCleaningTask]);

  const completeCleaningTask = useCallback(async (roomId: number) => {
    setCleaningAssignments(prev =>
      prev.map(ca =>
        ca.room_id === roomId && ca.status !== 'completed'
          ? { ...ca, status: 'completed', completed_at: new Date().toISOString() }
          : ca
      )
    );

    await updateRoomStatus(roomId, 'available');
  }, [updateRoomStatus]);

  const refreshData = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const value: BookingContextType = {
    bookings,
    rooms,
    hotels,
    guests,
    roomTypes,
    staff,
    cleaningAssignments,
    updateBookingStatus,
    updateBookingNotes,
    updateRoomStatus,
    assignCleaningTask,
    completeCleaningTask,
    confirmedCount,
    checkedInCount,
    checkedOutCount,
    availableRoomsCount,
    occupiedRoomsCount,
    refreshData,
    createBooking,
    confirmCheckIn,
    isLoading,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
