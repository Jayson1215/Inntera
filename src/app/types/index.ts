// Hotels
export interface Hotel {
  hotel_id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  created_at: string;
}

// Managers
export interface Manager {
  manager_id: number;
  hotel_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  hired_at: string;
}

// Staff
export interface Staff {
  staff_id: number;
  hotel_id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

// Amenities
export interface Amenity {
  amenity_id: number;
  name: string;
  description: string;
}

// Room Types
export interface RoomType {
  room_type_id: number;
  hotel_id: number;
  name: string;
  description?: string;
  max_occupancy: number;
  base_price: number;
  amenities_summary?: string;
}

// Room Amenities (Junction)
export interface RoomAmenity {
  room_amenity_id: number;
  room_type_id: number;
  amenity_id: number;
}

// Rooms
export interface Room {
  room_id: number;
  hotel_id: number;
  room_type_id: number;
  room_number: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  notes?: string;
}

// Rates
export interface Rate {
  rate_id: number;
  hotel_id: number;
  room_type_id: number;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
}

// Guests
export interface Guest {
  guest_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  loyalty_member_id?: string;
  created_at: string;
}

// Bookings
export interface Booking {
  booking_id: number;
  hotel_id: number;
  guest_id: number;
  booking_reference: string;
  checkin_date: string;
  checkout_date: string;
  booking_status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  created_at: string;
  modified_at: string;
  notes: string;
}

// Booking Rooms
export interface BookingRoom {
  booking_room_id: number;
  booking_id: number;
  room_id: number;
  room_type_id: number;
  rate: number;
  adults_count: number;
  children_count: number;
  status: string;
  allocated_at: string;
}

// Charges
export interface Charge {
  charge_id: number;
  booking_id: number;
  description: string;
  amount: number;
  tax_amount?: number;
  charge_date: string;
}

// Payments
export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_reference: string;
  paid_at: string;
}

// Auth User Session
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'staff' | 'manager' | 'admin';
  hotel_id?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

