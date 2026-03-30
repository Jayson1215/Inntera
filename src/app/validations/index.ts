import { z } from 'zod';

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Hotel Schemas
export const HotelCreateSchema = z.object({
  name: z.string().min(1, 'Hotel name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(1, 'Phone is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export const HotelUpdateSchema = HotelCreateSchema.partial();

// Room Type Schemas
export const RoomTypeCreateSchema = z.object({
  hotel_id: z.number().int().positive(),
  name: z.string().min(1, 'Room type name is required'),
  description: z.string().optional(),
  max_occupancy: z.number().int().positive('Max occupancy must be positive'),
  base_price: z.number().positive('Base price must be positive'),
  amenities_summary: z.string().optional(),
});

export const RoomTypeUpdateSchema = RoomTypeCreateSchema.partial();

// Room Schemas
export const RoomCreateSchema = z.object({
  hotel_id: z.number().int().positive(),
  room_type_id: z.number().int().positive(),
  room_number: z.string().min(1, 'Room number is required'),
  floor: z.string().min(1, 'Floor is required'),
  status: z.enum(['available', 'occupied', 'maintenance', 'reserved']).default('available'),
  notes: z.string().optional(),
});

export const RoomUpdateSchema = RoomCreateSchema.partial();

// Rate Schemas
export const RateCreateSchema = z.object({
  hotel_id: z.number().int().positive(),
  room_type_id: z.number().int().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().default('USD'),
}).refine((data: any) => new Date(data.start_date) < new Date(data.end_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const RateUpdateSchema = z.object({
  hotel_id: z.number().int().positive().optional(),
  room_type_id: z.number().int().positive().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  price: z.number().positive('Price must be positive').optional(),
  currency: z.string().default('USD').optional(),
});

// Guest Schemas
export const GuestCreateSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  loyalty_member_id: z.string().optional(),
});

export const GuestUpdateSchema = GuestCreateSchema.partial();

// Booking Schemas
export const BookingCreateSchema = z.object({
  hotel_id: z.number().int().positive(),
  guest_id: z.number().int().positive(),
  checkin_date: z.string().datetime('Invalid datetime format'),
  checkout_date: z.string().datetime('Invalid datetime format'),
  room_type_id: z.number().int().positive(),
  adults_count: z.number().int().min(1).default(1),
  children_count: z.number().int().min(0).default(0),
  notes: z.string().optional(),
}).refine((data: any) => new Date(data.checkin_date) < new Date(data.checkout_date), {
  message: 'Checkout date must be after checkin date',
  path: ['checkout_date'],
});

export const BookingUpdateSchema = z.object({
  booking_status: z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']).optional(),
  notes: z.string().optional(),
});

// Charge Schemas
export const ChargeCreateSchema = z.object({
  booking_id: z.number().int().positive(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  tax_amount: z.number().min(0).optional(),
});

// Payment Schemas
export const PaymentCreateSchema = z.object({
  booking_id: z.number().int().positive(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  payment_method: z.string().min(1, 'Payment method is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type HotelCreateInput = z.infer<typeof HotelCreateSchema>;
export type RoomTypeCreateInput = z.infer<typeof RoomTypeCreateSchema>;
export type RoomCreateInput = z.infer<typeof RoomCreateSchema>;
export type RateCreateInput = z.infer<typeof RateCreateSchema>;
export type GuestCreateInput = z.infer<typeof GuestCreateSchema>;
export type BookingCreateInput = z.infer<typeof BookingCreateSchema>;
export type ChargeCreateInput = z.infer<typeof ChargeCreateSchema>;
export type PaymentCreateInput = z.infer<typeof PaymentCreateSchema>;

