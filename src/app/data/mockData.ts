// Mock data based on the ERD schema

export interface Hotel {
  id: number;
  display_id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  created_at: string;
  image?: string;
}

export interface Manager {
  id: number;
  hotel_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  hired_at: string;
}

export interface Staff {
  id: number;
  display_id: string;
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
  bed_type: 'Single' | 'Double';
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
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order';
  notes: string;
  created_at?: string;
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
  total_cost?: number | string;
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
    id: 1,
    display_id: "HTL-001",
    name: "Watergate Boutique Hotel",
    address: "Jose Rosales Ave, Doongan",
    city: "Butuan City",
    phone: "+63 85 815 0088",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 2,
    display_id: "HTL-002",
    name: "Almont Inland Resort",
    address: "J.C. Aquino Ave",
    city: "Butuan City",
    phone: "+63 85 342 7414",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 3,
    display_id: "HTL-003",
    name: "Butuan Grand Palace Hotel",
    address: "J.P. Rizal St",
    city: "Butuan City",
    phone: "+63 85 342 0800",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 4,
    display_id: "HTL-004",
    name: "Go Hotels Butuan",
    address: "J.C. Aquino Ave, Brgy. Libertad",
    city: "Butuan City",
    phone: "+63 922 464 6835",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 5,
    display_id: "HTL-005",
    name: "Amarah Hotel",
    address: "Jose Rosales Ave, Doongan",
    city: "Butuan City",
    phone: "+63 85 817 9999",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 6,
    display_id: "HTL-006",
    name: "Almont City Hotel",
    address: "San Jose St",
    city: "Butuan City",
    phone: "+63 85 342 5263",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 7,
    display_id: "HTL-007",
    name: "Hotel Oazis Butuan",
    address: "J.C. Aquino Ave",
    city: "Butuan City",
    phone: "+63 85 342 8888",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 8,
    display_id: "HTL-008",
    name: "Big Daddy Hotel and Convention Center",
    address: "Imadejas",
    city: "Butuan City",
    phone: "+63 85 341 5111",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 9,
    display_id: "HTL-009",
    name: "Embassy Hotel",
    address: "Montilla Blvd",
    city: "Butuan City",
    phone: "+63 85 342 2222",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
  {
    id: 10,
    display_id: "HTL-010",
    name: "The Red Palm Suites and Restaurant",
    address: "Villa Kananga",
    city: "Butuan City",
    phone: "+63 85 341 8888",
    timezone: "Asia/Manila",
    created_at: "2024-03-31T00:00:00Z",
  },
];

export const managers: Manager[] = [
  {
    id: 1,
    hotel_id: 1,
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@grandplaza.com",
    phone: "+1 (212) 555-0101",
    role: "General Manager",
    hired_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
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
    id: 1,
    display_id: "STF-0001",
    hotel_id: 1,
    name: "Mike Davis",
    role: "Front Desk",
    email: "mike.davis@grandplaza.com",
    phone: "+1 (212) 555-0102",
  },
  {
    id: 2,
    display_id: "STF-0002",
    hotel_id: 1,
    name: "Emily Wilson",
    role: "Housekeeping",
    email: "emily.wilson@grandplaza.com",
    phone: "+1 (212) 555-0103",
  },
  {
    id: 3,
    display_id: "STF-0003",
    hotel_id: 2,
    name: "Robert Brown",
    role: "Concierge",
    email: "robert.brown@seaside.com",
    phone: "+1 (305) 555-0202",
  },
  {
    id: 4,
    display_id: "STF-0004",
    hotel_id: 4,
    name: "Mike Davis",
    role: "Manager",
    email: "mike.davis@watergate.com",
    phone: "+63 (85) 815 1515",
  },
];

export const roomTypes: RoomType[] = [
  {
    room_type_id: 1,
    hotel_id: 4,
    name: "Standard Single Room",
    description: "Compact and cozy Standard Room with a comfortable single bed.",
    max_occupancy: 1,
    base_price: 2000,
    bed_type: "Single",
    amenities_summary: "WiFi, Smart TV, AC, Hot Shower, Single Bed",
  },
  {
    room_type_id: 2,
    hotel_id: 4,
    name: "Standard Double Room",
    description: "Comfortable Standard Room with a spacious double bed.",
    max_occupancy: 2,
    base_price: 2800,
    bed_type: "Double",
    amenities_summary: "WiFi, Smart TV, AC, Hot Shower, Double Bed",
  },
  {
    room_type_id: 3,
    hotel_id: 4,
    name: "Deluxe Single Room",
    description: "Enhanced comfort with premium amenities and a single bed.",
    max_occupancy: 1,
    base_price: 4000,
    bed_type: "Single",
    amenities_summary: "WiFi, Smart TV, AC, Mini Bar, Single Bed, City View",
  },
  {
    room_type_id: 4,
    hotel_id: 4,
    name: "Deluxe Double Room",
    description: "Spacious Deluxe Room with premium views and a double bed.",
    max_occupancy: 2,
    base_price: 5200,
    bed_type: "Double",
    amenities_summary: "WiFi, Smart TV, AC, Mini Bar, Double Bed, Panoramic View",
  },
  {
    room_type_id: 5,
    hotel_id: 4,
    name: "Executive Suite",
    description: "Luxurious space with a separate living area and a king-sized double bed.",
    max_occupancy: 3,
    base_price: 12000,
    bed_type: "Double",
    amenities_summary: "WiFi, Smart TV, AC, Living Area, King Bed, Workspace, Spa Access",
  },
  {
    room_type_id: 6,
    hotel_id: 4,
    name: "Presidential Suite",
    description: "The ultimate luxury experience with butler service and a double bed.",
    max_occupancy: 4,
    base_price: 35000,
    bed_type: "Double",
    amenities_summary: "WiFi, Full Kitchen, Private Terrace, Jacuzzi, Butler Service, King Bed",
  },
  {
    room_type_id: 7,
    hotel_id: 5,
    name: "Standard Single",
    description: "Basic comfort in the heart of the resort with a single bed.",
    max_occupancy: 1,
    base_price: 2200,
    bed_type: "Single",
    amenities_summary: "WiFi, Smart TV, AC, Hot Shower, Single Bed",
  },
  {
    room_type_id: 8,
    hotel_id: 5,
    name: "Standard Double",
    description: "Resort comfort with a spacious double bed.",
    max_occupancy: 2,
    base_price: 3000,
    bed_type: "Double",
    amenities_summary: "WiFi, Smart TV, AC, Hot Shower, Double Bed",
  },
  {
    room_type_id: 9,
    hotel_id: 5,
    name: "Deluxe Double",
    description: "Spacious deluxe room with pool views and double bed.",
    max_occupancy: 2,
    base_price: 5500,
    bed_type: "Double",
    amenities_summary: "Pool View, WiFi, Smart TV, AC, Double Bed",
  },
  {
    room_type_id: 10,
    hotel_id: 5,
    name: "Inland Presidential",
    description: "Exclusive resort living with private pool access and concierge.",
    max_occupancy: 5,
    base_price: 45000,
    bed_type: "Double",
    amenities_summary: "Private Pool, WiFi, Smart TV, AC, Chef Service, King Beds",
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
  { room_id: 1, hotel_id: 1, room_type_id: 1, room_number: "701", floor: "7", status: "available", notes: "Executive floor" },
  { room_id: 2, hotel_id: 1, room_type_id: 1, room_number: "702", floor: "7", status: "occupied", notes: "" },
  { room_id: 3, hotel_id: 1, room_type_id: 1, room_number: "703", floor: "7", status: "available", notes: "" },
  { room_id: 4, hotel_id: 1, room_type_id: 2, room_number: "1001", floor: "10", status: "available", notes: "Penthouse" },
  { room_id: 5, hotel_id: 1, room_type_id: 2, room_number: "1002", floor: "10", status: "maintenance", notes: "AC repair scheduled" },
  { room_id: 6, hotel_id: 2, room_type_id: 3, room_number: "401", floor: "4", status: "available", notes: "Deluxe Ocean View" },
  { room_id: 7, hotel_id: 2, room_type_id: 3, room_number: "402", floor: "4", status: "available", notes: "" },
  { room_id: 8, hotel_id: 2, room_type_id: 4, room_number: "1001-V", floor: "10", status: "occupied", notes: "Presidential Villa" },
  { room_id: 11, hotel_id: 4, room_type_id: 6, room_number: "201", floor: "2", status: "available", notes: "Standard Floor" },
  { room_id: 12, hotel_id: 4, room_type_id: 6, room_number: "202", floor: "2", status: "occupied", notes: "" },
  { room_id: 13, hotel_id: 4, room_type_id: 7, room_number: "401", floor: "4", status: "available", notes: "Deluxe Floor" },
  { room_id: 14, hotel_id: 4, room_type_id: 8, room_number: "701", floor: "7", status: "available", notes: "Executive Floor" },
  { room_id: 15, hotel_id: 4, room_type_id: 9, room_number: "1001", floor: "10", status: "available", notes: "Presidential Floor" },
  { room_id: 16, hotel_id: 5, room_type_id: 10, room_number: "201", floor: "2", status: "available", notes: "Standard Floor" },
  { room_id: 17, hotel_id: 5, room_type_id: 11, room_number: "1001", floor: "10", status: "available", notes: "Presidential Suite" },
];

export const rates: Rate[] = [
  { rate_id: 1, hotel_id: 1, room_type_id: 1, start_date: "2026-01-01", end_date: "2026-06-30", price: 16500, currency: "PHP" },
  { rate_id: 2, hotel_id: 1, room_type_id: 1, start_date: "2026-07-01", end_date: "2026-12-31", price: 19250, currency: "PHP" },
  { rate_id: 3, hotel_id: 1, room_type_id: 2, start_date: "2026-01-01", end_date: "2026-12-31", price: 33000, currency: "PHP" },
  { rate_id: 4, hotel_id: 2, room_type_id: 3, start_date: "2026-01-01", end_date: "2026-12-31", price: 19250, currency: "PHP" },
  { rate_id: 5, hotel_id: 2, room_type_id: 4, start_date: "2026-01-01", end_date: "2026-12-31", price: 49500, currency: "PHP" },
];

export const guests: Guest[] = [
  {
    id: 1,
    display_id: "GUEST-1001",
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
    id: 2,
    display_id: "GUEST-1002",
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
    booking_status: "checked-in",
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
    amount: 75847,
    currency: "PHP",
    payment_method: "Credit Card",
    status: "completed",
    transaction_reference: "TXN-2026-001",
    paid_at: "2026-03-15T10:40:00Z",
  },
  {
    payment_id: 2,
    booking_id: 2,
    amount: 56923,
    currency: "PHP",
    payment_method: "Credit Card",
    status: "completed",
    transaction_reference: "TXN-2026-002",
    paid_at: "2026-03-10T14:30:00Z",
  },
  {
    payment_id: 3,
    booking_id: 3,
    amount: 247497,
    currency: "PHP",
    payment_method: "Pending",
    status: "pending",
    transaction_reference: "TXN-2026-003",
    paid_at: "",
  },
];

// Admin credentials
export const adminUser = {
  email: "admin@inntera.com",
  password: "admin123",
  role: "admin",
};

// Staff user for demo (staff_id: 1)
export const staffUser = {
  id: 1,
  email: "mike.davis@grandplaza.com",
  password: "staff123",
  role: "staff",
};

