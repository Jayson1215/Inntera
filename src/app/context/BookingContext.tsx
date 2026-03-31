import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { bookings as initialBookings, rooms as initialRooms, Booking, Room } from '../data/mockData';

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
  updateBookingStatus: (bookingId: number, newStatus: Booking['booking_status']) => void;
  updateBookingNotes: (bookingId: number, notes: string) => void;
  updateRoomStatus: (roomId: number, newStatus: Room['status']) => void;
  getConfirmedCount: () => number;
  getCheckedInCount: () => number;
  getCheckedOutCount: () => number;
  getAvailableRoomsCount: () => number;
  getOccupiedRoomsCount: () => number;
  refreshFromStorage: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('hotel_bookings');
    return stored ? JSON.parse(stored) : initialBookings;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const stored = localStorage.getItem('hotel_rooms');
    return stored ? JSON.parse(stored) : initialRooms;
  });

  // Sync state on mount and when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRooms = localStorage.getItem('hotel_rooms');
      const storedBookings = localStorage.getItem('hotel_bookings');
      
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      }
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateBookingStatus = useCallback((bookingId: number, newStatus: Booking['booking_status']) => {
    setBookings(prevBookings => {
      const updated = prevBookings.map(b =>
        b.booking_id === bookingId
          ? { ...b, booking_status: newStatus, modified_at: new Date().toISOString() }
          : b
      );
      localStorage.setItem('hotel_bookings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateBookingNotes = useCallback((bookingId: number, notes: string) => {
    setBookings(prevBookings => {
      const updated = prevBookings.map(b =>
        b.booking_id === bookingId
          ? { ...b, notes, modified_at: new Date().toISOString() }
          : b
      );
      localStorage.setItem('hotel_bookings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateRoomStatus = useCallback((roomId: number, newStatus: Room['status']) => {
    setRooms(prevRooms => {
      const updated = prevRooms.map(r =>
        r.room_id === roomId
          ? { ...r, status: newStatus }
          : r
      );
      localStorage.setItem('hotel_rooms', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refreshFromStorage = useCallback(() => {
    const storedRooms = localStorage.getItem('hotel_rooms');
    const storedBookings = localStorage.getItem('hotel_bookings');
    
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

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
    updateBookingStatus,
    updateBookingNotes,
    updateRoomStatus,
    getConfirmedCount,
    getCheckedInCount,
    getCheckedOutCount,
    getAvailableRoomsCount,
    getOccupiedRoomsCount,
    refreshFromStorage,
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
