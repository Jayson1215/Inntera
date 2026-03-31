import pool from '@/app/lib/db';
import { Room } from '@/app/types';

export const roomRepository = {
  async getAll(): Promise<Room[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM rooms ORDER BY room_number');
      return rows as Room[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<Room[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM rooms WHERE hotel_id = ? ORDER BY floor, room_number',
        [hotelId]
      );
      return rows as Room[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Room | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM rooms WHERE room_id = ?', [id]);
      const results = rows as Room[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getAvailableRooms(hotelId: number, roomTypeId: number, checkinDate: string, checkoutDate: string): Promise<Room[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT r.* FROM rooms r
         WHERE r.hotel_id = ? 
         AND r.room_type_id = ?
         AND r.status IN ('available', 'reserved')
         AND r.room_id NOT IN (
           SELECT DISTINCT br.room_id FROM booking_rooms br
           JOIN bookings b ON br.booking_id = b.booking_id
           WHERE b.hotel_id = ?
           AND b.booking_status NOT IN ('cancelled', 'checked_out')
           AND (
             (? < b.checkout_date AND ? > b.checkin_date)
           )
         )
         ORDER BY floor, room_number`,
        [hotelId, roomTypeId, hotelId, checkinDate, checkoutDate]
      );
      return rows as Room[];
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Room, 'room_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [data.hotel_id, data.room_type_id, data.room_number, data.floor, data.status, data.notes]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Room, 'room_id'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE rooms SET ${fields} WHERE room_id = ?`,
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
      const [result] = await connection.query('DELETE FROM rooms WHERE room_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

