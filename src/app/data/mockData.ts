// Mock data based on the ERD schema

export interface Hotel {
  hotel_id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  created_at: string;
  image?: string;
}

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

export interface Staff {
  staff_id: number;
  hotel_id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface RoomType {
  room_type_id: number;
  hotel_id: number;
  name: string;
  description: string;
  max_occupancy: number;
  base_price: number;
  amenities_summary: string;
  image?: string;
}

export interface Amenity {
  amenity_id: number;
  name: string;
  description: string;
}

export interface RoomAmenity {
  room_amenity_id: number;
  room_type_id: number;
  amenity_id: number;
}

export interface Room {
  room_id: number;
  hotel_id: number;
  room_type_id: number;
  room_number: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  notes: string;
}

export interface Rate {
  rate_id: number;
  hotel_id: number;
  room_type_id: number;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
}

export interface Guest {
  guest_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  loyalty_member_id?: string;
  created_at: string;
  password?: string; // For demo authentication
}

export interface Booking {
  booking_id: number;
  hotel_id: number;
  guest_id: number;
  booking_reference: string;
  checkin_date: string;
  checkout_date: string;
  booking_status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  created_at: string;
  modified_at: string;
  notes: string;
}

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

export interface Charge {
  charge_id: number;
  booking_id: number;
  description: string;
  amount: number;
  tax_amount: number;
  charge_date: string;
}

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

// Mock Data
export const hotels: Hotel[] = [
  {
    hotel_id: 1,
    name: "Grand Plaza Hotel",
    address: "123 Main Street",
    city: "New York",
    phone: "+1 (212) 555-0100",
    timezone: "America/New_York",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    hotel_id: 2,
    name: "Seaside Resort & Spa",
    address: "456 Ocean Drive",
    city: "Miami",
    phone: "+1 (305) 555-0200",
    timezone: "America/New_York",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    hotel_id: 3,
    name: "Mountain View Lodge",
    address: "789 Alpine Way",
    city: "Denver",
    phone: "+1 (303) 555-0300",
    timezone: "America/Denver",
    created_at: "2024-02-01T00:00:00Z",
  },
];

export const managers: Manager[] = [
  {
    manager_id: 1,
    hotel_id: 1,
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@grandplaza.com",
    phone: "+1 (212) 555-0101",
    role: "General Manager",
    hired_at: "2024-01-01T00:00:00Z",
  },
  {
    manager_id: 2,
    hotel_id: 2,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@seaside.com",
    phone: "+1 (305) 555-0201",
    role: "General Manager",
    hired_at: "2024-01-15T00:00:00Z",
  },
];

export const staff: Staff[] = [
  {
    staff_id: 1,
    hotel_id: 1,
    name: "Mike Davis",
    role: "Front Desk",
    email: "mike.davis@grandplaza.com",
    phone: "+1 (212) 555-0102",
  },
  {
    staff_id: 2,
    hotel_id: 1,
    name: "Emily Wilson",
    role: "Housekeeping",
    email: "emily.wilson@grandplaza.com",
    phone: "+1 (212) 555-0103",
  },
  {
    staff_id: 3,
    hotel_id: 2,
    name: "Robert Brown",
    role: "Concierge",
    email: "robert.brown@seaside.com",
    phone: "+1 (305) 555-0202",
  },
];

export const roomTypes: RoomType[] = [
  {
    room_type_id: 1,
    hotel_id: 1,
    name: "Deluxe King",
    description: "Spacious room with king-size bed, city views, and premium amenities",
    max_occupancy: 2,
    base_price: 299.99,
    amenities_summary: "King bed, City view, WiFi, Mini bar, Coffee maker",
  },
  {
    room_type_id: 2,
    hotel_id: 1,
    name: "Executive Suite",
    description: "Luxurious suite with separate living area, premium furnishings",
    max_occupancy: 4,
    base_price: 599.99,
    amenities_summary: "King bed, Living room, City view, WiFi, Mini bar, Jacuzzi",
  },
  {
    room_type_id: 3,
    hotel_id: 2,
    name: "Ocean View Room",
    description: "Beautiful room with direct ocean views and balcony",
    max_occupancy: 2,
    base_price: 349.99,
    amenities_summary: "Queen bed, Ocean view, Balcony, WiFi, Mini bar",
  },
  {
    room_type_id: 4,
    hotel_id: 2,
    name: "Beachfront Villa",
    description: "Private villa with direct beach access and luxury amenities",
    max_occupancy: 6,
    base_price: 899.99,
    amenities_summary: "2 Bedrooms, Private pool, Beach access, Full kitchen",
  },
  {
    room_type_id: 5,
    hotel_id: 3,
    name: "Mountain Cabin",
    description: "Cozy cabin with mountain views and fireplace",
    max_occupancy: 4,
    base_price: 249.99,
    amenities_summary: "Queen bed, Fireplace, Mountain view, WiFi, Kitchenette",
  },
];

export const amenities: Amenity[] = [
  { amenity_id: 1, name: "WiFi", description: "High-speed wireless internet" },
  { amenity_id: 2, name: "Mini Bar", description: "Stocked mini refrigerator" },
  { amenity_id: 3, name: "TV", description: "Smart TV with streaming" },
  { amenity_id: 4, name: "Air Conditioning", description: "Climate control" },
  { amenity_id: 5, name: "Balcony", description: "Private outdoor space" },
  { amenity_id: 6, name: "Ocean View", description: "Direct ocean views" },
  { amenity_id: 7, name: "City View", description: "Panoramic city views" },
  { amenity_id: 8, name: "Jacuzzi", description: "In-room hot tub" },
  { amenity_id: 9, name: "Kitchen", description: "Full kitchen facilities" },
  { amenity_id: 10, name: "Fireplace", description: "Gas or wood fireplace" },
];

export const roomAmenities: RoomAmenity[] = [
  { room_amenity_id: 1, room_type_id: 1, amenity_id: 1 },
  { room_amenity_id: 2, room_type_id: 1, amenity_id: 2 },
  { room_amenity_id: 3, room_type_id: 1, amenity_id: 3 },
  { room_amenity_id: 4, room_type_id: 1, amenity_id: 4 },
  { room_amenity_id: 5, room_type_id: 1, amenity_id: 7 },
  { room_amenity_id: 6, room_type_id: 2, amenity_id: 1 },
  { room_amenity_id: 7, room_type_id: 2, amenity_id: 2 },
  { room_amenity_id: 8, room_type_id: 2, amenity_id: 8 },
];

export const rooms: Room[] = [
  { room_id: 1, hotel_id: 1, room_type_id: 1, room_number: "101", floor: "1", status: "available", notes: "" },
  { room_id: 2, hotel_id: 1, room_type_id: 1, room_number: "102", floor: "1", status: "occupied", notes: "" },
  { room_id: 3, hotel_id: 1, room_type_id: 1, room_number: "103", floor: "1", status: "available", notes: "" },
  { room_id: 4, hotel_id: 1, room_type_id: 2, room_number: "201", floor: "2", status: "available", notes: "" },
  { room_id: 5, hotel_id: 1, room_type_id: 2, room_number: "202", floor: "2", status: "maintenance", notes: "AC repair scheduled" },
  { room_id: 6, hotel_id: 2, room_type_id: 3, room_number: "301", floor: "3", status: "available", notes: "" },
  { room_id: 7, hotel_id: 2, room_type_id: 3, room_number: "302", floor: "3", status: "available", notes: "" },
  { room_id: 8, hotel_id: 2, room_type_id: 4, room_number: "Villa-1", floor: "Ground", status: "occupied", notes: "" },
  { room_id: 9, hotel_id: 3, room_type_id: 5, room_number: "C-1", floor: "1", status: "available", notes: "" },
  { room_id: 10, hotel_id: 3, room_type_id: 5, room_number: "C-2", floor: "1", status: "available", notes: "" },
];

export const rates: Rate[] = [
  { rate_id: 1, hotel_id: 1, room_type_id: 1, start_date: "2026-01-01", end_date: "2026-06-30", price: 299.99, currency: "USD" },
  { rate_id: 2, hotel_id: 1, room_type_id: 1, start_date: "2026-07-01", end_date: "2026-12-31", price: 349.99, currency: "USD" },
  { rate_id: 3, hotel_id: 1, room_type_id: 2, start_date: "2026-01-01", end_date: "2026-12-31", price: 599.99, currency: "USD" },
  { rate_id: 4, hotel_id: 2, room_type_id: 3, start_date: "2026-01-01", end_date: "2026-12-31", price: 349.99, currency: "USD" },
  { rate_id: 5, hotel_id: 2, room_type_id: 4, start_date: "2026-01-01", end_date: "2026-12-31", price: 899.99, currency: "USD" },
];

export const guests: Guest[] = [
  {
    guest_id: 1,
    first_name: "Alice",
    last_name: "Cooper",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    address: "789 Park Ave, New York, NY",
    loyalty_member_id: "LOYAL001",
    created_at: "2025-12-01T00:00:00Z",
    password: "password123",
  },
  {
    guest_id: 2,
    first_name: "Bob",
    last_name: "Martin",
    email: "bob@example.com",
    phone: "+1 (555) 234-5678",
    address: "456 Beach Blvd, Miami, FL",
    created_at: "2025-12-15T00:00:00Z",
    password: "password123",
  },
];

export const bookings: Booking[] = [
  {
    booking_id: 1,
    hotel_id: 1,
    guest_id: 1,
    booking_reference: "BK-2026-001",
    checkin_date: "2026-04-01T15:00:00Z",
    checkout_date: "2026-04-05T11:00:00Z",
    booking_status: "confirmed",
    created_at: "2026-03-15T10:30:00Z",
    modified_at: "2026-03-15T10:30:00Z",
    notes: "Late check-in requested",
  },
  {
    booking_id: 2,
    hotel_id: 1,
    guest_id: 2,
    booking_reference: "BK-2026-002",
    checkin_date: "2026-03-25T15:00:00Z",
    checkout_date: "2026-03-28T11:00:00Z",
    booking_status: "checked-in",
    created_at: "2026-03-10T14:20:00Z",
    modified_at: "2026-03-25T15:05:00Z",
    notes: "",
  },
  {
    booking_id: 3,
    hotel_id: 2,
    guest_id: 1,
    booking_reference: "BK-2026-003",
    checkin_date: "2026-05-15T15:00:00Z",
    checkout_date: "2026-05-20T11:00:00Z",
    booking_status: "pending",
    created_at: "2026-03-20T09:15:00Z",
    modified_at: "2026-03-20T09:15:00Z",
    notes: "Anniversary celebration",
  },
];

export const bookingRooms: BookingRoom[] = [
  {
    booking_room_id: 1,
    booking_id: 1,
    room_id: 1,
    room_type_id: 1,
    rate: 299.99,
    adults_count: 2,
    children_count: 0,
    status: "confirmed",
    allocated_at: "2026-03-15T10:35:00Z",
  },
  {
    booking_room_id: 2,
    booking_id: 2,
    room_id: 2,
    room_type_id: 1,
    rate: 299.99,
    adults_count: 1,
    children_count: 0,
    status: "occupied",
    allocated_at: "2026-03-10T14:25:00Z",
  },
  {
    booking_room_id: 3,
    booking_id: 3,
    room_id: 8,
    room_type_id: 4,
    rate: 899.99,
    adults_count: 2,
    children_count: 2,
    status: "pending",
    allocated_at: "2026-03-20T09:20:00Z",
  },
];

export const charges: Charge[] = [
  {
    charge_id: 1,
    booking_id: 1,
    description: "Room charges (4 nights)",
    amount: 1199.96,
    tax_amount: 179.99,
    charge_date: "2026-03-15T10:35:00Z",
  },
  {
    charge_id: 2,
    booking_id: 2,
    description: "Room charges (3 nights)",
    amount: 899.97,
    tax_amount: 135.00,
    charge_date: "2026-03-10T14:25:00Z",
  },
  {
    charge_id: 3,
    booking_id: 2,
    description: "Room service",
    amount: 45.50,
    tax_amount: 6.83,
    charge_date: "2026-03-26T20:15:00Z",
  },
];

export const payments: Payment[] = [
  {
    payment_id: 1,
    booking_id: 1,
    amount: 1379.95,
    currency: "USD",
    payment_method: "Credit Card",
    status: "completed",
    transaction_reference: "TXN-2026-001",
    paid_at: "2026-03-15T10:40:00Z",
  },
  {
    payment_id: 2,
    booking_id: 2,
    amount: 1034.97,
    currency: "USD",
    payment_method: "Credit Card",
    status: "completed",
    transaction_reference: "TXN-2026-002",
    paid_at: "2026-03-10T14:30:00Z",
  },
  {
    payment_id: 3,
    booking_id: 3,
    amount: 4499.95,
    currency: "USD",
    payment_method: "Pending",
    status: "pending",
    transaction_reference: "TXN-2026-003",
    paid_at: "",
  },
];

// Admin credentials
export const adminUser = {
  email: "admin@hotelbook.com",
  password: "admin123",
  role: "admin",
};

// Staff user for demo (staff_id: 1)
export const staffUser = {
  staff_id: 1,
  email: "mike.davis@grandplaza.com",
  password: "staff123",
  role: "staff",
};

