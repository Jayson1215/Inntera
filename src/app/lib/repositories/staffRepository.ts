import pool from '@/app/lib/db';
import { Staff, Manager } from '@/app/types';

export const staffRepository = {
  async getAll(): Promise<Staff[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM staff ORDER BY name');
      return rows as Staff[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<Staff[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM staff WHERE hotel_id = ? ORDER BY name',
        [hotelId]
      );
      return rows as Staff[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Staff | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM staff WHERE staff_id = ?', [id]);
      const results = rows as Staff[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Staff, 'staff_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO staff (hotel_id, name, role, email, phone) VALUES (?, ?, ?, ?, ?)',
        [data.hotel_id, data.name, data.role, data.email, data.phone]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Staff, 'staff_id'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE staff SET ${fields} WHERE staff_id = ?`,
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
      const [result] = await connection.query('DELETE FROM staff WHERE staff_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

export const managerRepository = {
  async getAll(): Promise<Manager[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM managers ORDER BY last_name, first_name');
      return rows as Manager[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<Manager[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM managers WHERE hotel_id = ? ORDER BY last_name, first_name',
        [hotelId]
      );
      return rows as Manager[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Manager | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM managers WHERE manager_id = ?', [id]);
      const results = rows as Manager[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getByEmail(email: string): Promise<Manager | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM managers WHERE email = ?', [email]);
      const results = rows as Manager[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Manager, 'manager_id' | 'hired_at'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO managers (hotel_id, first_name, last_name, email, phone, role, hired_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [data.hotel_id, data.first_name, data.last_name, data.email, data.phone, data.role]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Manager, 'manager_id' | 'hired_at'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE managers SET ${fields} WHERE manager_id = ?`,
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
      const [result] = await connection.query('DELETE FROM managers WHERE manager_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

