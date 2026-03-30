import pool from '@/lib/db';
import { Hotel } from '@/types';

export const hotelRepository = {
  async getAll(): Promise<Hotel[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM hotels');
      return rows as Hotel[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Hotel | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM hotels WHERE hotel_id = ?', [id]);
      const results = rows as Hotel[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Hotel, 'hotel_id' | 'created_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO hotels (name, address, city, phone, timezone) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.address, data.city, data.phone, data.timezone]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Hotel, 'hotel_id' | 'created_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE hotels SET ${fields} WHERE hotel_id = ?`,
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
      const [result] = await connection.query('DELETE FROM hotels WHERE hotel_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

