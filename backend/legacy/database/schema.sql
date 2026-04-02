-- Inntera - Enterprise Hotel Booking System Database Schema
-- MySQL 8.0+

-- Create Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
  hotel_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  phone VARCHAR(30),
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_name (name)
);

-- Create Managers Table
CREATE TABLE IF NOT EXISTS managers (
  manager_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30),
  role VARCHAR(100),
  hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_email (email)
);

-- Create Staff Table
CREATE TABLE IF NOT EXISTS staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(30),
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_email (email)
);

-- Create Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
  amenity_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  INDEX idx_name (name)
);

-- Create Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
  room_type_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  name VARCHAR(255),
  description TEXT,
  max_occupancy INT,
  base_price DECIMAL(10,2),
  amenities_summary TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_name (name)
);

-- Create Room Amenities Junction Table
CREATE TABLE IF NOT EXISTS room_amenities (
  room_amenity_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_id INT NOT NULL,
  amenity_id INT NOT NULL,
  FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE,
  UNIQUE KEY unique_room_amenity (room_type_id, amenity_id),
  INDEX idx_amenity_id (amenity_id)
);

-- Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  room_type_id INT NOT NULL,
  room_number VARCHAR(20),
  floor VARCHAR(10),
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id) ON DELETE CASCADE,
  UNIQUE KEY unique_room (hotel_id, room_number),
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_room_type_id (room_type_id),
  INDEX idx_status (status)
);

-- Create Rates Table
CREATE TABLE IF NOT EXISTS rates (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  room_type_id INT NOT NULL,
  start_date DATE,
  end_date DATE,
  price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'PHP',
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_room_type_id (room_type_id),
  INDEX idx_date_range (start_date, end_date)
);

-- Create Guests Table
CREATE TABLE IF NOT EXISTS guests (
  guest_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30),
  address TEXT,
  loyalty_member_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_loyalty_id (loyalty_member_id)
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  guest_id INT NOT NULL,
  booking_reference VARCHAR(50) UNIQUE,
  checkin_date TIMESTAMP,
  checkout_date TIMESTAMP,
  booking_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_guest_id (guest_id),
  INDEX idx_booking_reference (booking_reference),
  INDEX idx_booking_status (booking_status),
  INDEX idx_checkin_date (checkin_date)
);

-- Create Booking Rooms Table
CREATE TABLE IF NOT EXISTS booking_rooms (
  booking_room_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  room_id INT,
  room_type_id INT,
  rate DECIMAL(10,2),
  adults_count INT DEFAULT 1,
  children_count INT DEFAULT 0,
  status VARCHAR(50),
  allocated_at TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id),
  INDEX idx_room_id (room_id)
);

-- Create Charges Table
CREATE TABLE IF NOT EXISTS charges (
  charge_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  charge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id),
  INDEX idx_charge_date (charge_date)
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'PHP',
  payment_method VARCHAR(100),
  status VARCHAR(50),
  transaction_reference VARCHAR(255),
  paid_at TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id),
  INDEX idx_status (status),
  INDEX idx_paid_at (paid_at)
);

-- Seed Data (Optional)
-- Insert sample hotels
INSERT INTO hotels (name, address, city, phone, timezone) VALUES
('Grand Hotel Downtown', '123 Main St', 'New York', '212-555-0100', 'America/New_York'),
('Seaside Resort', '456 Ocean Ave', 'Miami', '305-555-0200', 'America/New_York'),
('Mountain Lodge', '789 Peak Rd', 'Denver', '303-555-0300', 'America/Denver');

-- Insert sample amenities
INSERT INTO amenities (name, description) VALUES
('WiFi', 'High-speed internet'),
('Air Conditioning', 'Climate control'),
('Pool', 'Outdoor swimming pool'),
('Gym', 'Fitness center'),
('Restaurant', 'On-site dining'),
('Room Service', '24/7 room service');

-- Insert sample room types for hotel 1
INSERT INTO room_types (hotel_id, name, description, max_occupancy, base_price, amenities_summary) VALUES
(1, 'Standard Room', 'Basic single room', 1, 8250.00, 'WiFi, AC, Bed, TV'),
(1, 'Double Room', 'Room for two', 2, 11000.00, 'WiFi, AC, Double Bed, TV'),
(1, 'Suite', 'Luxury suite',  4, 19250.00, 'WiFi, AC, Living Area, Jacuzzi');

-- Insert sample rooms for hotel 1
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES
(1, 1, '101', '1', 'available'),
(1, 1, '102', '1', 'available'),
(1, 2, '201', '2', 'available'),
(1, 2, '202', '2', 'available'),
(1, 3, '301', '3', 'available');

-- Insert sample rates
INSERT INTO rates (hotel_id, room_type_id, start_date, end_date, price, currency) VALUES
(1, 1, '2024-01-01', '2024-12-31', 8250.00, 'PHP'),
(1, 2, '2024-01-01', '2024-12-31', 11000.00, 'PHP'),
(1, 3, '2024-01-01', '2024-12-31', 19250.00, 'PHP');
