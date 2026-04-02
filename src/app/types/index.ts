// Hotels
export interface Hotel {
  id: number;
  display_id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  star_rating?: number;
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
  id: number;
  display_id: string;
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
  bed_type: 'Single' | 'Double';
  amenities_summary?: string;
  amenities?: Amenity[];
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
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'cleaning';
  notes: string;
  created_at?: string;
  room_type?: RoomType;
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
  id: number;
  display_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
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
  booking_status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  total_cost: number;
  created_at: string;
  modified_at?: string;
  notes?: string;
  // Embedded relations from API
  hotel?: Hotel;
  guest?: Guest;
  booking_rooms?: BookingRoom[];
  payments?: Payment[];
  charges?: Charge[];
}

// Booking Rooms
export interface BookingRoom {
  id?: number;
  booking_id: number;
  room_id: number;
  room_type_id?: number;
  rate: number;
  adults_count: number;
  children_count: number;
  number_of_nights?: number;
  status?: string;
  allocated_at?: string;
  room?: Room;
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

