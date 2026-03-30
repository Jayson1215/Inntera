import pool from '@/lib/db';
import { Amenity, RoomAmenity } from '@/types';

export const amenityRepository = {
  async getAll(): Promise<Amenity[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM amenities ORDER BY name');
      return rows as Amenity[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<Amenity | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM amenities WHERE amenity_id = ?', [id]);
      const results = rows as Amenity[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<Amenity, 'amenity_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO amenities (name, description) VALUES (?, ?)',
        [data.name, data.description]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<Amenity, 'amenity_id'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE amenities SET ${fields} WHERE amenity_id = ?`,
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
      const [result] = await connection.query('DELETE FROM amenities WHERE amenity_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

export const roomAmenityRepository = {
  async getByRoomType(roomTypeId: number): Promise<RoomAmenity[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM room_amenities WHERE room_type_id = ?',
        [roomTypeId]
      );
      return rows as RoomAmenity[];
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<RoomAmenity, 'room_amenity_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO room_amenities (room_type_id, amenity_id) VALUES (?, ?)',
        [data.room_type_id, data.amenity_id]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM room_amenities WHERE room_amenity_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async deleteByRoomType(roomTypeId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'DELETE FROM room_amenities WHERE room_type_id = ?',
        [roomTypeId]
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

