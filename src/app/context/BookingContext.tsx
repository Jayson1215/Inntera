import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Booking, Room, Hotel, Guest, RoomType, Staff } from '../types';
import { bookingService, roomService, hotelService, guestService, roomTypeService, staffService, paymentService } from '../lib/api';

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
  getConfirmedCount: () => number;
  getCheckedInCount: () => number;
  getCheckedOutCount: () => number;
  getAvailableRoomsCount: () => number;
  getOccupiedRoomsCount: () => number;
  refreshFromStorage: () => void;
  refreshData: () => Promise<void>;
  createBooking: (data: any) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  confirmCheckIn: (bookingId: number, paymentData?: any, notes?: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [cleaningAssignments, setCleaningAssignments] = useState<CleaningAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, roomsRes, hotelsRes, guestsRes, roomTypesRes, staffRes] = await Promise.all([
        bookingService.getAll(),
        roomService.getBy(),
        hotelService.getAll(),
        guestService.getAll(),
        roomTypeService.getBy(),
        staffService.getAll(),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
      if (roomsRes.success && roomsRes.data) {
        setRooms(roomsRes.data);
      }
      if (hotelsRes.success && hotelsRes.data) {
        setHotels(hotelsRes.data);
      }
      if (guestsRes.success && guestsRes.data) {
        setGuests(guestsRes.data);
      }
      if (roomTypesRes.success && roomTypesRes.data) {
        setRoomTypes(roomTypesRes.data);
      }
      if (staffRes.success && staffRes.data) {
        setStaff(staffRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createBooking = useCallback(async (data: any) => {
    try {
      const response = await bookingService.create(data);
      if (response.success && response.data) {
        // Full refresh to get the new booking with all relations (hotel, rooms, payments)
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
      // 1. Update Booking Status to checked-in
      const statusRes = await bookingService.updateStatus(bookingId, 'checked-in');

      if (!statusRes.success) {
        return { success: false, error: statusRes.error || 'Failed to update booking status' };
      }

      // 2. If notes provided, update them
      if (notes) {
        await bookingService.update(bookingId, { notes } as any);
      }

      // 3. If payment data provided, create a payment record
      if (paymentData) {
        await paymentService.create({
          booking_id: bookingId,
          ...paymentData,
          status: 'completed',
          payment_date: new Date().toISOString(),
        });
      }

      // 4. Refresh all relevant data to ensure UI is in sync
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

    // Call API
    const response = await bookingService.updateStatus(bookingId, newStatus);
    if (response.success) {
      // Refresh rooms since booking status changes may affect room status
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

    // Find available staff for this hotel based on the requested task type
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

    // Auto-assign tasks dynamically based on status
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

    // Set room status back to available
    await updateRoomStatus(roomId, 'available');
  }, [updateRoomStatus]);

  const refreshFromStorage = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const getConfirmedCount = useCallback(() => {
    return bookings.filter(b => b.booking_status === 'confirmed').length;
  }, [bookings]);

  const getCheckedInCount = useCallback(() => {
    return bookings.filter(b => b.booking_status === 'checked-in').length;
  }, [bookings]);

  const getCheckedOutCount = useCallback(() => {
    return bookings.filter(b => b.booking_status === 'checked-out').length;
  }, [bookings]);

  const getAvailableRoomsCount = useCallback(() => {
    return rooms.filter(r => r.status === 'available').length;
  }, [rooms]);

  const getOccupiedRoomsCount = useCallback(() => {
    return rooms.filter(r => r.status === 'occupied').length;
  }, [rooms]);

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
    getConfirmedCount,
    getCheckedInCount,
    getCheckedOutCount,
    getAvailableRoomsCount,
    getOccupiedRoomsCount,
    refreshFromStorage,
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
