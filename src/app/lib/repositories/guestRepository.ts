import pool from '@/lib/db';
import { Guest } from '@/types';

export const guestRepository = {
  async getAll(): Promise<Guest[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM guests ORDER BY last_name, first_name');
      return rows as Guest[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Guest | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM guests WHERE guest_id = ?', [id]);
      const results = rows as Guest[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getByEmail(email: string): Promise<Guest | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM guests WHERE email = ?', [email]);
      const results = rows as Guest[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Guest, 'guest_id' | 'created_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO guests (first_name, middle_name, last_name, email, phone, address, loyalty_member_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.first_name, data.middle_name, data.last_name, data.email, data.phone, data.address, data.loyalty_member_id]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Guest, 'guest_id' | 'created_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE guests SET ${fields} WHERE guest_id = ?`,
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
      const [result] = await connection.query('DELETE FROM guests WHERE guest_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

