import pool from '@/app/lib/db';
import { Booking, BookingRoom } from '@/app/types';

// Generate booking reference: HTL-{HOTEL_ID}-{YYYYMMDD}-{RANDOM6}
function generateBookingReference(hotelId: number): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HTL-${hotelId}-${date}-${random}`;
}

export const bookingRepository = {
  async getAll(): Promise<(Booking & { guest_name: string })[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT b.*, CONCAT(g.first_name, ' ', g.last_name) as guest_name
         FROM bookings b
         JOIN guests g ON b.guest_id = g.guest_id
         ORDER BY b.created_at DESC`
      );
      return rows as (Booking & { guest_name: string })[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<(Booking & { guest_name: string })[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT b.*, CONCAT(g.first_name, ' ', g.last_name) as guest_name
         FROM bookings b
         JOIN guests g ON b.guest_id = g.guest_id
         WHERE b.hotel_id = ?
         ORDER BY b.created_at DESC`,
        [hotelId]
      );
      return rows as (Booking & { guest_name: string })[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Booking | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM bookings WHERE booking_id = ?', [id]);
      const results = rows as Booking[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getByReference(reference: string): Promise<Booking | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM bookings WHERE booking_reference = ?', [reference]);
      const results = rows as Booking[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getByGuest(guestId: number): Promise<(Booking & { guest_name: string; room_count: number })[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT b.*, CONCAT(g.first_name, ' ', g.last_name) as guest_name, COUNT(br.booking_room_id) as room_count
         FROM bookings b
         JOIN guests g ON b.guest_id = g.guest_id
         LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
         WHERE b.guest_id = ?
         GROUP BY b.booking_id
         ORDER BY b.created_at DESC`,
        [guestId]
      );
      return rows as (Booking & { guest_name: string; room_count: number })[];
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Booking, 'booking_id' | 'booking_reference' | 'created_at' | 'modified_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const bookingReference = generateBookingReference(data.hotel_id);
      const [result] = await connection.query(
        `INSERT INTO bookings (hotel_id, guest_id, booking_reference, checkin_date, checkout_date, booking_status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.hotel_id, data.guest_id, bookingReference, data.checkin_date, data.checkout_date, data.booking_status, data.notes]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Booking, 'booking_id' | 'booking_reference' | 'created_at' | 'modified_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE bookings SET ${fields}, modified_at = NOW() WHERE booking_id = ?`,
        [...values, id]
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM bookings WHERE booking_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

export const bookingRoomRepository = {
  async getByBooking(bookingId: number): Promise<BookingRoom[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM booking_rooms WHERE booking_id = ?',
        [bookingId]
      );
      return rows as BookingRoom[];
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<BookingRoom, 'booking_room_id' | 'allocated_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO booking_rooms (booking_id, room_id, room_type_id, rate, adults_count, children_count, status, allocated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [data.booking_id, data.room_id, data.room_type_id, data.rate, data.adults_count, data.children_count, data.status]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<BookingRoom, 'booking_room_id' | 'allocated_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE booking_rooms SET ${fields} WHERE booking_room_id = ?`,
        [...values, id]
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM booking_rooms WHERE booking_room_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

