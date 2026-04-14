import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Booking, Room, Hotel, Guest, RoomType, Staff } from '../types';
import { bookingService, roomService, hotelService, roomTypeService, staffService, guestService, paymentService, systemService } from '../lib/api';
import { toast } from 'sonner';

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
  updateBookingStatus: (bookingId: number, newStatus: Booking['booking_status']) => Promise<void>;
  updateBookingNotes: (bookingId: number, notes: string) => Promise<void>;
  updateRoomStatus: (roomId: number, newStatus: Room['status']) => Promise<void>;
  assignCleaningTask: (roomId: number, taskType?: 'cleaning' | 'maintenance') => void;
  completeCleaningTask: (roomId: number) => Promise<void>;
  confirmedCount: number;
  checkedInCount: number;
  checkedOutCount: number;
  availableRoomsCount: number;
  occupiedRoomsCount: number;
  refreshData: () => Promise<void>;
  addHotel: (data: any) => Promise<{ success: boolean; data?: Hotel; error?: string }>;
  updateHotel: (id: number, data: any) => Promise<{ success: boolean; data?: Hotel; error?: string }>;
  deleteHotel: (id: number) => Promise<{ success: boolean; error?: string }>;
  addRoom: (data: any) => Promise<{ success: boolean; data?: Room; error?: string }>;
  updateRoom: (id: number, data: any) => Promise<{ success: boolean; data?: Room; error?: string }>;
  deleteRoom: (id: number) => Promise<{ success: boolean; error?: string }>;
  addRoomType: (data: any) => Promise<{ success: boolean; data?: RoomType; error?: string }>;
  updateRoomType: (id: number, data: any) => Promise<{ success: boolean; data?: RoomType; error?: string }>;
  deleteRoomType: (id: number) => Promise<{ success: boolean; error?: string }>;
  addStaff: (data: any) => Promise<{ success: boolean; data?: Staff; error?: string }>;
  updateStaff: (id: number, data: any) => Promise<{ success: boolean; data?: Staff; error?: string }>;
  deleteStaff: (id: number) => Promise<{ success: boolean; error?: string }>;
  addGuest: (data: any) => Promise<{ success: boolean; data?: Guest; error?: string }>;
  updateGuest: (id: number, data: any) => Promise<{ success: boolean; data?: Guest; error?: string }>;
  deleteGuest: (id: number) => Promise<{ success: boolean; error?: string }>;
  createBooking: (data: any) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  deleteBooking: (id: number) => Promise<{ success: boolean; error?: string }>;
  confirmCheckIn: (bookingId: number, paymentData?: any, notes?: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const CACHE_KEY = 'hotel_system_cache_v4';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [cleaningAssignments, setCleaningAssignments] = useState<CleaningAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (force = false) => {
    const hasCache = !!localStorage.getItem(CACHE_KEY);
    if (!hasCache || force) setIsLoading(true);

    try {
      const res = await systemService.init();

      if (res.success && res.data) {
        const cacheData = {
          bookings: res.data.bookings || [],
          rooms: res.data.rooms || [],
          hotels: res.data.hotels || [],
          guests: res.data.guests || [],
          roomTypes: res.data.roomTypes || [],
          staff: res.data.staff || [],
          lastFetch: Date.now(),
        };

        setBookings(cacheData.bookings);
        setRooms(cacheData.rooms);
        setHotels(cacheData.hotels);
        setGuests(cacheData.guests);
        setRoomTypes(cacheData.roomTypes);
        setStaff(cacheData.staff);
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } else if (res.error && force) {
        toast.error('Sync failed: ' + res.error);
      }
    } catch (error: any) {
      console.error('Data fetch error:', error);
      if (force) toast.error('Check server connection');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem(CACHE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setBookings(parsed.bookings || []);
        setRooms(parsed.rooms || []);
        setHotels(parsed.hotels || []);
        setGuests(parsed.guests || []);
        setRoomTypes(parsed.roomTypes || []);
        setStaff(parsed.staff || []);
        setIsLoading(false);
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }
    fetchData();
  }, [fetchData]);

  const confirmedCount = useMemo(() => bookings.filter(b => b.booking_status === 'confirmed').length, [bookings]);
  const checkedInCount = useMemo(() => bookings.filter(b => b.booking_status === 'checked-in').length, [bookings]);
  const checkedOutCount = useMemo(() => bookings.filter(b => b.booking_status === 'checked-out').length, [bookings]);
  const availableRoomsCount = useMemo(() => rooms.filter(r => r.status === 'available').length, [rooms]);
  const occupiedRoomsCount = useMemo(() => rooms.filter(r => r.status === 'occupied').length, [rooms]);

  const handleResponse = async <T,>(promise: Promise<any>, successMsg: string): Promise<{ success: boolean; data?: T; error?: string }> => {
    try {
      const res = await promise;
      if (res.success) {
        await fetchData(true);
        return { success: true, data: res.data };
      }
      
      const errorStr = res.error || 
                      (res.errors ? Object.values(res.errors)[0] : null) || 
                      'Operation failed';
                      
      return { success: false, error: String(errorStr) };
    } catch (error: any) {
      return { success: false, error: error?.message || 'An unexpected error occurred' };
    }
  };

  const addHotel = (data: any) => handleResponse<Hotel>(hotelService.create(data), 'Hotel added');
  const updateHotel = (id: number, data: any) => handleResponse<Hotel>(hotelService.update(id, data), 'Hotel updated');
  const deleteHotel = (id: number) => handleResponse<void>(hotelService.delete(id), 'Hotel deleted');

  const addRoom = (data: any) => handleResponse<Room>(roomService.create(data), 'Room added');
  const updateRoom = (id: number, data: any) => handleResponse<Room>(roomService.update(id, data), 'Room updated');
  const deleteRoom = (id: number) => handleResponse<void>(roomService.delete(id), 'Room deleted');

  const addRoomType = (data: any) => handleResponse<RoomType>(roomTypeService.create(data), 'Room type added');
  const updateRoomType = (id: number, data: any) => handleResponse<RoomType>(roomTypeService.update(id, data), 'Room type updated');
  const deleteRoomType = (id: number) => handleResponse<void>(roomTypeService.delete(id), 'Room type deleted');

  const addStaff = (data: any) => handleResponse<Staff>(staffService.create(data), 'Staff added');
  const updateStaff = (id: number, data: any) => handleResponse<Staff>(staffService.update(id, data), 'Staff updated');
  const deleteStaff = (id: number) => handleResponse<void>(staffService.delete(id), 'Staff deleted');

  const addGuest = (data: any) => handleResponse<Guest>(guestService.create(data), 'Guest added');
  const updateGuest = (id: number, data: any) => handleResponse<Guest>(guestService.update(id, data), 'Guest updated');
  const deleteGuest = (id: number) => handleResponse<void>(guestService.delete(id), 'Guest deleted');

  const createBooking = (data: any) => handleResponse<Booking>(bookingService.create(data), 'Booking created');
  const deleteBooking = (id: number) => handleResponse<void>(bookingService.delete(id), 'Reservation cancelled');

  const confirmCheckIn = useCallback(async (bookingId: number, paymentData?: any, notes?: string) => {
    setIsLoading(true);
    try {
      const statusRes = await bookingService.updateStatus(bookingId, 'checked-in');
      if (!statusRes.success) return { success: false, error: statusRes.error };

      if (notes) await bookingService.update(bookingId, { notes } as any);
      if (paymentData) {
        await paymentService.create({
          booking_id: bookingId,
          ...paymentData,
          status: 'completed',
          payment_date: new Date().toISOString(),
        });
      }

      await fetchData(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Check-in failed' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const updateBookingStatus = useCallback(async (bookingId: number, newStatus: Booking['booking_status']) => {
    await bookingService.updateStatus(bookingId, newStatus);
    await fetchData(true);
  }, [fetchData]);

  const updateBookingNotes = useCallback(async (bookingId: number, notes: string) => {
    await bookingService.update(bookingId, { notes } as any);
    await fetchData(true);
  }, [fetchData]);

  const assignCleaningTask = useCallback((roomId: number, taskType: 'cleaning' | 'maintenance' = 'cleaning') => {
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) return;

    const availableStaff = staff.find(s => {
      const r = (s.role || (s as any).position || '').toLowerCase();
      const roleMatch = taskType === 'cleaning' ? (r.includes('housekeep') || r.includes('clean')) : r.includes('mainten');
      return s.hotel_id === room.hotel_id && roleMatch && !cleaningAssignments.some(ca => ca.staff_id === s.id && ca.status !== 'completed');
    });

    if (availableStaff) {
      setCleaningAssignments(prev => [...prev, {
        room_id: roomId,
        staff_id: availableStaff.id,
        status: 'pending',
        assigned_at: new Date().toISOString(),
      }]);
    }
  }, [rooms, staff, cleaningAssignments]);

  const updateRoomStatus = useCallback(async (roomId: number, newStatus: Room['status']) => {
    await roomService.updateStatus(roomId, newStatus);
    if (newStatus === 'cleaning' || newStatus === 'maintenance') {
      assignCleaningTask(roomId, newStatus);
    }
    await fetchData(true);
  }, [fetchData, assignCleaningTask]);

  const completeCleaningTask = useCallback(async (roomId: number) => {
    setCleaningAssignments(prev => prev.map(ca => ca.room_id === roomId && ca.status !== 'completed' ? { ...ca, status: 'completed', completed_at: new Date().toISOString() } : ca));
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
    addHotel,
    updateHotel,
    deleteHotel,
    addRoom,
    updateRoom,
    deleteRoom,
    addRoomType,
    updateRoomType,
    deleteRoomType,
    addStaff,
    updateStaff,
    deleteStaff,
    addGuest,
    updateGuest,
    deleteGuest,
    createBooking,
    deleteBooking,
    confirmCheckIn,
    isLoading,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
}
