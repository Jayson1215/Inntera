import pool from '@/lib/db';
import { Payment } from '@/types';

export const paymentRepository = {
  async getByBooking(bookingId: number): Promise<Payment[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM payments WHERE booking_id = ? ORDER BY paid_at DESC',
        [bookingId]
      );
      return rows as Payment[];
    } finally {
      connection.release();
    }
  },

  async getTotalByBooking(bookingId: number): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payments 
         WHERE booking_id = ? AND status = 'completed'`,
        [bookingId]
      );
      const results = rows as any[];
      return results[0]?.total || 0;
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Payment | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM payments WHERE payment_id = ?', [id]);
      const results = rows as Payment[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Payment, 'payment_id' | 'paid_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO payments (booking_id, amount, currency, payment_method, status, transaction_reference, paid_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [data.booking_id, data.amount, data.currency, data.payment_method, data.status, data.transaction_reference]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Payment, 'payment_id' | 'paid_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE payments SET ${fields} WHERE payment_id = ?`,
        [...values, id]
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

