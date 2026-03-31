import pool from '@/app/lib/db';
import { Rate } from '@/app/types';

export const rateRepository = {
  async getAll(): Promise<Rate[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM rates ORDER BY start_date DESC');
      return rows as Rate[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<Rate[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM rates WHERE hotel_id = ? ORDER BY start_date DESC',
        [hotelId]
      );
      return rows as Rate[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Rate | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM rates WHERE rate_id = ?', [id]);
      const results = rows as Rate[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getApplicableRate(roomTypeId: number, date: string): Promise<Rate | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT * FROM rates 
         WHERE room_type_id = ? 
         AND start_date <= ? 
         AND end_date >= ?
         LIMIT 1`,
        [roomTypeId, date, date]
      );
      const results = rows as Rate[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Rate, 'rate_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO rates (hotel_id, room_type_id, start_date, end_date, price, currency)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.hotel_id, data.room_type_id, data.start_date, data.end_date, data.price, data.currency]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Rate, 'rate_id'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE rates SET ${fields} WHERE rate_id = ?`,
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
      const [result] = await connection.query('DELETE FROM rates WHERE rate_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

