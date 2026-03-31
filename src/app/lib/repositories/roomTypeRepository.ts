import pool from '@/app/lib/db';
import { RoomType, Amenity } from '@/app/types';

export const roomTypeRepository = {
  async getAll(): Promise<RoomType[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM room_types ORDER BY name');
      return rows as RoomType[];
    } finally {
      connection.release();
    }
  },

  async getByHotel(hotelId: number): Promise<RoomType[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY name',
        [hotelId]
      );
      return rows as RoomType[];
    } finally {
      connection.release();
    }
  },

  async getById(id: number): Promise<RoomType | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM room_types WHERE room_type_id = ?', [id]);
      const results = rows as RoomType[];
      return results[0] || null;
    } finally {
      connection.release();
    }
  },

  async getWithAmenities(id: number): Promise<(RoomType & { amenities: Amenity[] }) | null> {
    const connection = await pool.getConnection();
    try {
      const [roomRows] = await connection.query('SELECT * FROM room_types WHERE room_type_id = ?', [id]);
      const roomTypes = roomRows as RoomType[];
      if (!roomTypes[0]) return null;

      const [amenityRows] = await connection.query(
        `SELECT a.* FROM amenities a
         JOIN room_amenities ra ON a.amenity_id = ra.amenity_id
         WHERE ra.room_type_id = ?`,
        [id]
      );

      return {
        ...roomTypes[0],
        amenities: amenityRows as Amenity[],
      };
    } finally {
      connection.release();
    }
  },

  async create(data: Omit<RoomType, 'room_type_id'>): Promise<number> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO room_types (hotel_id, name, description, max_occupancy, base_price, amenities_summary) VALUES (?, ?, ?, ?, ?, ?)',
        [data.hotel_id, data.name, data.description, data.max_occupancy, data.base_price, data.amenities_summary]
      );
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  },

  async update(id: number, data: Partial<Omit<RoomType, 'room_type_id'>>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);
      const [result] = await connection.query(
        `UPDATE room_types SET ${fields} WHERE room_type_id = ?`,
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
      const [result] = await connection.query('DELETE FROM room_types WHERE room_type_id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  },
};

