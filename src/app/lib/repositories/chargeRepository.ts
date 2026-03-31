import pool from '@/app/lib/db';
import { Charge } from '@/app/types';

export const chargeRepository = {
  async getByBooking(bookingId: number): Promise<Charge[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM charges WHERE booking_id = ? ORDER BY charge_date DESC',
        [bookingId]
      );
      return rows as Charge[];
    } finally {
      connection.release();
    }
  },

  async getTotalByBooking(bookingId: number): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT COALESCE(SUM(amount + tax_amount), 0) as total FROM charges WHERE booking_id = ?`,
        [bookingId]
      );
      const results = rows as any[];
      return results[0]?.total || 0;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Charge, 'charge_id' | 'charge_date'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO charges (booking_id, description, amount, tax_amount, charge_date)
         VALUES (?, ?, ?, ?, NOW())`,
        [data.booking_id, data.description, data.amount, data.tax_amount]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM charges WHERE charge_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

