import { hotelRepository } from '@/lib/repositories/hotelRepository';
import { roomTypeRepository } from '@/lib/repositories/roomTypeRepository';
import { roomRepository } from '@/lib/repositories/roomRepository';
import { rateRepository } from '@/lib/repositories/rateRepository';
import { guestRepository } from '@/lib/repositories/guestRepository';
import { bookingRepository, bookingRoomRepository } from '@/lib/repositories/bookingRepository';
import { chargeRepository } from '@/lib/repositories/chargeRepository';
import { Room, RoomType, Rate, Guest } from '@/types';

export const bookingService = {
  // Calculate total price for a booking
  async calculateBookingPrice(
    roomTypeId: number,
    checkinDate: string,
    checkoutDate: string,
    adultsCount: number,
    childrenCount: number
  ): Promise<{
    basePrice: number;
    totalPrice: number;
    nights: number;
    roomType: RoomType | null;
  }> {
    const roomType = await roomTypeRepository.getById(roomTypeId);
    if (!roomType) {
      throw new Error('Room type not found');
    }

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));

    // Get the applicable rate for the check-in date
    const rate = await rateRepository.getApplicableRate(roomTypeId, checkinDate);
    const pricePerNight = rate?.price || roomType.base_price;

    const totalPrice = pricePerNight * nights;

    return {
      basePrice: pricePerNight,
      totalPrice,
      nights,
      roomType,
    };
  },

  // Check room availability
  async checkAvailability(
    hotelId: number,
    roomTypeId: number,
    checkinDate: string,
    checkoutDate: string
  ): Promise<Room[]> {
    return roomRepository.getAvailableRooms(hotelId, roomTypeId, checkinDate, checkoutDate);
  },

  // Create a complete booking
  async createBooking(
    hotelId: number,
    guestEmail: string,
    firstName: string,
    lastName: string,
    phone: string,
    roomTypeId: number,
    checkinDate: string,
    checkoutDate: string,
    adultsCount: number,
    childrenCount: number
  ): Promise<{
    bookingId: number;
    bookingReference: string;
    totalPrice: number;
  }> {
    // Get or create guest
    let guest = await guestRepository.getByEmail(guestEmail);
    if (!guest) {
      const guestId = await guestRepository.create({
        first_name: firstName,
        last_name: lastName,
        middle_name: '',
        email: guestEmail,
        phone,
        address: '',
        loyalty_member_id: '',
      });
      guest = await guestRepository.getById(guestId);
    }

    if (!guest) {
      throw new Error('Failed to create or retrieve guest');
    }

    // Calculate price
    const pricing = await this.calculateBookingPrice(
      roomTypeId,
      checkinDate,
      checkoutDate,
      adultsCount,
      childrenCount
    );

    // Create booking
    const bookingId = await bookingRepository.create({
      hotel_id: hotelId,
      guest_id: guest.guest_id,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      booking_status: 'pending',
      notes: '',
    });

    // Get available rooms
    const availableRooms = await this.checkAvailability(hotelId, roomTypeId, checkinDate, checkoutDate);
    
    if (availableRooms.length === 0) {
      // Delete the created booking if no rooms available
      await bookingRepository.delete(bookingId);
      throw new Error('No rooms available for the selected dates');
    }

    // Allocate the first available room
    const room = availableRooms[0];
    await bookingRoomRepository.create({
      booking_id: bookingId,
      room_id: room.room_id,
      room_type_id: roomTypeId,
      rate: pricing.basePrice,
      adults_count: adultsCount,
      children_count: childrenCount,
      status: 'reserved',
    });

    // Create a charge for the room
    await chargeRepository.create({
      booking_id: bookingId,
      description: `${pricing.roomType?.name} - ${pricing.nights} nights`,
      amount: pricing.totalPrice,
      tax_amount: 0,
    });

    // Get booking with reference
    const booking = await bookingRepository.getById(bookingId);
    if (!booking) {
      throw new Error('Failed to retrieve created booking');
    }

    return {
      bookingId: booking.booking_id,
      bookingReference: booking.booking_reference,
      totalPrice: pricing.totalPrice,
    };
  },
};

export const roomService = {
  // Get all available rooms for a hotel and date range
  async getAvailableRooms(hotelId: number, checkinDate: string, checkoutDate: string) {
    const roomTypes = await roomTypeRepository.getByHotel(hotelId);
    
    const roomsWithAvailability = await Promise.all(
      roomTypes.map(async (roomType: any) => {
        const availableRooms = await roomRepository.getAvailableRooms(
          hotelId,
          roomType.room_type_id,
          checkinDate,
          checkoutDate
        );
        
        const pricing = await rateRepository.getApplicableRate(
          roomType.room_type_id,
          checkinDate
        );

        return {
          ...roomType,
          availableCount: availableRooms.length,
          pricePerNight: pricing?.price || roomType.base_price,
        };
      })
    );

    return roomsWithAvailability.filter((r: any) => r.availableCount > 0);
  },
};

export const hotelService = {
  // Get hotel with all related data
  async getHotelDetails(hotelId: number) {
    const hotel = await hotelRepository.getById(hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const roomTypes = await roomTypeRepository.getByHotel(hotelId);
    const rooms = await roomRepository.getByHotel(hotelId);

    return {
      hotel,
      roomTypes,
      rooms,
    };
  },
};

