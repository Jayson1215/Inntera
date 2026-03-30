// API Service Layer - abstraction for backend calls
// Can be connected to a real backend later

import { 
  Hotel, 
  Room, 
  RoomType, 
  Booking, 
  Guest, 
  Rate
} from '../data/mockData';
import { 
  HotelCreateSchema, 
  RoomCreateSchema, 
  BookingCreateSchema,
  GuestCreateSchema,
  RateCreateSchema
} from '../validations';
import { z } from 'zod';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

// Hotels
export const hotelService = {
  async getAll(): Promise<ApiResponse<Hotel[]>> {
    try {
      // TODO: Replace with actual API call
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch hotels' };
    }
  },

  async getById(id: number): Promise<ApiResponse<Hotel>> {
    try {
      // TODO: Replace with actual API call
      return { success: true, data: {} as Hotel };
    } catch (error) {
      return { success: false, error: 'Failed to fetch hotel' };
    }
  },

  async create(data: z.infer<typeof HotelCreateSchema>): Promise<ApiResponse<Hotel>> {
    try {
      const validated = HotelCreateSchema.parse(data);
      // TODO: Replace with actual API call
      return { success: true, data: { hotel_id: 1, ...validated, created_at: new Date().toISOString() } };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
        return { success: false, errors };
      }
      return { success: false, error: 'Failed to create hotel' };
    }
  },

  async update(id: number, data: Partial<Hotel>): Promise<ApiResponse<Hotel>> {
    try {
      // TODO: Replace with actual API call
      return { success: true, data: { ...data } as Hotel };
    } catch (error) {
      return { success: false, error: 'Failed to update hotel' };
    }
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      // TODO: Replace with actual API call
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete hotel' };
    }
  },
};

// Rooms
export const roomService = {
  async getBy(hotelId?: number): Promise<ApiResponse<Room[]>> {
    try {
      // TODO: Replace with actual API call
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch rooms' };
    }
  },

  async create(data: z.infer<typeof RoomCreateSchema>): Promise<ApiResponse<Room>> {
    try {
      const validated = RoomCreateSchema.parse(data);
      return { success: true, data: { room_id: 1, ...validated } as Room };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
        return { success: false, errors };
      }
      return { success: false, error: 'Failed to create room' };
    }
  },

  async updateStatus(roomId: number, status: Room['status']): Promise<ApiResponse<Room>> {
    try {
      return { success: true, data: {} as Room };
    } catch (error) {
      return { success: false, error: 'Failed to update room status' };
    }
  },
};

// Bookings
export const bookingService = {
  async getAll(filters?: { hotelId?: number; guestId?: number }): Promise<ApiResponse<Booking[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch bookings' };
    }
  },

  async create(data: z.infer<typeof BookingCreateSchema>): Promise<ApiResponse<Booking>> {
    try {
      const validated = BookingCreateSchema.parse(data);
      return { success: true, data: { booking_id: 1, ...validated, booking_reference: 'HTL-' + Date.now(), booking_status: 'pending', created_at: new Date().toISOString(), modified_at: new Date().toISOString() } as unknown as Booking };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
        return { success: false, errors };
      }
      return { success: false, error: 'Failed to create booking' };
    }
  },

  async updateStatus(bookingId: number, status: Booking['booking_status']): Promise<ApiResponse<Booking>> {
    try {
      return { success: true, data: {} as Booking };
    } catch (error) {
      return { success: false, error: 'Failed to update booking' };
    }
  },

  async checkIn(bookingId: number): Promise<ApiResponse<Booking>> {
    return this.updateStatus(bookingId, 'checked-in');
  },

  async checkOut(bookingId: number): Promise<ApiResponse<Booking>> {
    return this.updateStatus(bookingId, 'checked-out');
  },
};

// Guests
export const guestService = {
  async getAll(): Promise<ApiResponse<Guest[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch guests' };
    }
  },

  async create(data: z.infer<typeof GuestCreateSchema>): Promise<ApiResponse<Guest>> {
    try {
      const validated = GuestCreateSchema.parse(data);
      return { success: true, data: { guest_id: 1, ...validated, created_at: new Date().toISOString() } as Guest };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
        return { success: false, errors };
      }
      return { success: false, error: 'Failed to create guest' };
    }
  },
};

// Room Types
export const roomTypeService = {
  async getBy(hotelId?: number): Promise<ApiResponse<RoomType[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch room types' };
    }
  },

  async create(data: z.infer<typeof RateCreateSchema>): Promise<ApiResponse<RoomType>> {
    try {
      return { success: true, data: {} as RoomType };
    } catch (error) {
      return { success: false, error: 'Failed to create room type' };
    }
  },
};

// Rates
export const rateService = {
  async getForDateRange(
    hotelId: number,
    roomTypeId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Rate[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch rates' };
    }
  },

  async create(data: z.infer<typeof RateCreateSchema>): Promise<ApiResponse<Rate>> {
    try {
      return { success: true, data: {} as Rate };
    } catch (error) {
      return { success: false, error: 'Failed to create rate' };
    }
  },
};
