// API Service Layer - connected to Laravel backend
// All requests go through the Vite proxy (/api -> http://localhost:8000/api)

import {
  Hotel,
  Room,
  RoomType,
  Booking,
  Guest,
  Rate,
  Amenity,
  Payment,
  Charge,
  Staff,
  Notification,
} from '../types';
import {
  HotelCreateSchema,
  RoomCreateSchema,
  GuestCreateSchema,
  RateCreateSchema,
} from '../validations';
import { z } from 'zod';

// Auth response shape
export interface AuthUser {
  email: string;
  role: 'admin' | 'staff' | 'guest';
  id: number;
  display_id: string;
  name: string;
  hotel_id: number | null;
}

// Dashboard stats shape
export interface DashboardStats {
  hotels: number;
  rooms: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    reserved: number;
  };
  guests: number;
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    checked_in: number;
    checked_out: number;
    cancelled: number;
  };
  recent_bookings: Booking[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

// Use the environment variable in production, fallback to local proxy during development
const getApiBase = () => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) return '/api';
  
  // Normalize: If they gave the root URL (without /api), add it. 
  // If they gave it correctly (with /api), leave it alone.
  const hasApi = base.toLowerCase().endsWith('/api') || base.toLowerCase().includes('/api/');
  return hasApi ? base : `${base.replace(/\/$/, '')}/api`;
};

const API_BASE = getApiBase();

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for initial heavy load or slow networks

  try {
    const storedUser = localStorage.getItem('hotel_user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-User-Id': user?.id?.toString() || '',
        'X-User-Type': user?.role || '',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    
    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      // Laravel validation errors
      if (json.errors && typeof json.errors === 'object') {
        const flatErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(json.errors)) {
          flatErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
        }
        return { success: false, errors: flatErrors };
      }

      // Handle object-style errors (e.g. { error: { message: '...' } } or { message: { code: '...', message: '...' } })
      let errorMsg: any = json.error || json.message || 'Request failed';
      if (typeof errorMsg === 'object' && errorMsg !== null) {
        errorMsg = errorMsg.message || JSON.stringify(errorMsg);
      }
      
      return { success: false, error: String(errorMsg) };
    }

    return { success: true, data: json.data };
  } catch (error: any) {
    console.error('API Error:', error);
    // Ensure the catch-all error is also a safe string
    const message = error?.message || 'Network error. Is the backend running?';
    return { success: false, error: String(message) };
  }
}

// Hotels
export const hotelService = {
  async getAll(): Promise<ApiResponse<Hotel[]>> {
    return apiFetch<Hotel[]>('/hotels');
  },

  async getById(id: number): Promise<ApiResponse<Hotel>> {
    return apiFetch<Hotel>(`/hotels/${id}`);
  },

  async create(data: z.infer<typeof HotelCreateSchema>): Promise<ApiResponse<Hotel>> {
    return apiFetch<Hotel>('/hotels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<Hotel>): Promise<ApiResponse<Hotel>> {
    return apiFetch<Hotel>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/hotels/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rooms
export const roomService = {
  async getBy(hotelId?: number): Promise<ApiResponse<Room[]>> {
    const params = hotelId ? `?hotel_id=${hotelId}` : '';
    return apiFetch<Room[]>(`/rooms${params}`);
  },

  async getById(id: number): Promise<ApiResponse<Room>> {
    return apiFetch<Room>(`/rooms/${id}`);
  },

  async create(data: z.infer<typeof RoomCreateSchema>): Promise<ApiResponse<Room>> {
    return apiFetch<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<Room>): Promise<ApiResponse<Room>> {
    return apiFetch<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(roomId: number, status: Room['status']): Promise<ApiResponse<Room>> {
    return apiFetch<Room>(`/rooms/${roomId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings
export const bookingService = {
  async getAll(filters?: { hotelId?: number; guestId?: number }): Promise<ApiResponse<Booking[]>> {
    const params = new URLSearchParams();
    if (filters?.hotelId) params.append('hotel_id', String(filters.hotelId));
    if (filters?.guestId) params.append('guest_id', String(filters.guestId));
    const qs = params.toString();
    return apiFetch<Booking[]>(`/bookings${qs ? '?' + qs : ''}`);
  },

  async getById(id: number): Promise<ApiResponse<Booking>> {
    return apiFetch<Booking>(`/bookings/${id}`);
  },

  async create(data: Record<string, unknown>): Promise<ApiResponse<Booking>> {
    return apiFetch<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return apiFetch<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(bookingId: number, status: Booking['booking_status']): Promise<ApiResponse<Booking>> {
    return apiFetch<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ booking_status: status }),
    });
  },

  async checkIn(booking_id: number): Promise<ApiResponse<Booking>> {
    return this.updateStatus(booking_id, 'checked-in');
  },

  async checkOut(booking_id: number): Promise<ApiResponse<Booking>> {
    return this.updateStatus(booking_id, 'checked-out');
  },
  
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Guests
export const guestService = {
  async getAll(): Promise<ApiResponse<Guest[]>> {
    return apiFetch<Guest[]>('/guests');
  },

  async getById(id: number): Promise<ApiResponse<Guest>> {
    return apiFetch<Guest>(`/guests/${id}`);
  },

  async create(data: z.infer<typeof GuestCreateSchema>): Promise<ApiResponse<Guest>> {
    return apiFetch<Guest>('/guests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<Guest>): Promise<ApiResponse<Guest>> {
    return apiFetch<Guest>(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/guests/${id}`, {
      method: 'DELETE',
    });
  },
};

// Room Types
export const roomTypeService = {
  async getBy(hotelId?: number): Promise<ApiResponse<RoomType[]>> {
    const params = hotelId ? `?hotel_id=${hotelId}` : '';
    return apiFetch<RoomType[]>(`/room-types${params}`);
  },

  async getById(id: number): Promise<ApiResponse<RoomType>> {
    return apiFetch<RoomType>(`/room-types/${id}`);
  },

  async create(data: any): Promise<ApiResponse<RoomType>> {
    return apiFetch<RoomType>('/room-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<ApiResponse<RoomType>> {
    return apiFetch<RoomType>(`/room-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/room-types/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rates
export const rateService = {
  async getAll(filters?: { hotelId?: number; roomTypeId?: number }): Promise<ApiResponse<Rate[]>> {
    const params = new URLSearchParams();
    if (filters?.hotelId) params.append('hotel_id', String(filters.hotelId));
    if (filters?.roomTypeId) params.append('room_type_id', String(filters.roomTypeId));
    const qs = params.toString();
    return apiFetch<Rate[]>(`/rates${qs ? '?' + qs : ''}`);
  },

  async getForDateRange(
    hotelId: number,
    roomTypeId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Rate[]>> {
    const params = new URLSearchParams({
      hotel_id: String(hotelId),
      room_type_id: String(roomTypeId),
    });
    return apiFetch<Rate[]>(`/rates?${params.toString()}`);
  },

  async create(data: z.infer<typeof RateCreateSchema>): Promise<ApiResponse<Rate>> {
    return apiFetch<Rate>('/rates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<ApiResponse<Rate>> {
    return apiFetch<Rate>(`/rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Amenities
export const amenityService = {
  async getAll(): Promise<ApiResponse<Amenity[]>> {
    return apiFetch<Amenity[]>('/amenities');
  },
};

// Staff
export const staffService = {
  async getAll(hotelId?: number): Promise<ApiResponse<Staff[]>> {
    const params = hotelId ? `?hotel_id=${hotelId}` : '';
    return apiFetch<Staff[]>(`/staff${params}`);
  },

  async create(data: any): Promise<ApiResponse<Staff>> {
    return apiFetch<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<ApiResponse<Staff>> {
    return apiFetch<Staff>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/staff/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payments
export const paymentService = {
  async getByBooking(bookingId: number): Promise<ApiResponse<Payment[]>> {
    return apiFetch<Payment[]>(`/payments?booking_id=${bookingId}`);
  },

  async create(data: any): Promise<ApiResponse<Payment>> {
    return apiFetch<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Charges
export const chargeService = {
  async getByBooking(bookingId: number): Promise<ApiResponse<Charge[]>> {
    return apiFetch<Charge[]>(`/charges?booking_id=${bookingId}`);
  },

  async create(data: any): Promise<ApiResponse<Charge>> {
    return apiFetch<Charge>('/charges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Auth
export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
    return apiFetch<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    password: string;
    role: 'guest' | 'staff';
  }): Promise<ApiResponse<AuthUser>> {
    return apiFetch<AuthUser>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Dashboard
export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiFetch<DashboardStats>('/dashboard/stats');
  },
};

// System Init
export const systemService = {
  async init(): Promise<ApiResponse<{
    bookings: Booking[];
    rooms: Room[];
    hotels: Hotel[];
    guests: Guest[];
    roomTypes: RoomType[];
    staff: Staff[];
  }>> {
    return apiFetch('/system/init');
  },
};

// Notifications
export const notificationService = {
  async getAll(): Promise<ApiResponse<{
    notifications: Notification[];
    unread_count: number;
  }>> {
    return apiFetch('/notifications');
  },

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiFetch('/notifications/mark-all-read', { method: 'PATCH' });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch(`/notifications/${id}`, { method: 'DELETE' });
  },
};
// Admin Management
export const adminService = {
  async banGuest(id: number): Promise<ApiResponse<{ status: string }>> {
    return apiFetch<{ status: string }>(`/admin/guests/${id}/ban`, {
      method: 'PATCH',
    });
  },

  async removeGuest(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/admin/guests/${id}`, {
      method: 'DELETE',
    });
  },

  async suspendStaff(id: number): Promise<ApiResponse<{ status: string }>> {
    return apiFetch<{ status: string }>(`/admin/staff/${id}/suspend`, {
      method: 'PATCH',
    });
  },

  async removeStaff(id: number): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/admin/staff/${id}`, {
      method: 'DELETE',
    });
  },
};

