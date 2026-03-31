import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { MapPin, Phone, Star, Users, Wifi, Coffee, Tv } from 'lucide-react';
import { hotels, roomTypes, amenities, roomAmenities } from '../../data/mockData';
import { toast } from 'sonner';

export function ClientHotelDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const hotel = hotels.find(h => h.hotel_id === parseInt(hotelId || '0'));
  const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === parseInt(hotelId || '0'));

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Hotel not found</p>
        <Button onClick={() => navigate('/client/search')} className="mt-4">
          Back to Search
        </Button>
      </div>
    );
  }

  const handleBookRoom = (roomTypeId: number) => {
    setIsBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    toast.success('Booking request submitted successfully!');
    setIsBookingDialogOpen(false);
    setTimeout(() => navigate('/client/bookings'), 1500);
  };

  const getRoomAmenities = (roomTypeId: number) => {
    const amenityIds = roomAmenities
      .filter(ra => ra.room_type_id === roomTypeId)
      .map(ra => ra.amenity_id);
    return amenities.filter(a => amenityIds.includes(a.amenity_id));
  };

  return (
    <div>
      {/* Hotel Header */}
      <Card className="mb-8 border-2 border-emerald-500 bg-white shadow-lg">
        <CardContent className="p-8 !bg-white">
          <div className="flex gap-8">
            <div className="w-64 h-64 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <div className="text-6xl mb-2">🏨</div>
                <p className="text-sm text-gray-700 font-medium">Hotel Image</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-black">{hotel.name}</h1>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  {hotel.address}, {hotel.city}
                </div>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  {hotel.phone}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-black">Hotel Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Free WiFi
                  </Badge>
                  <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1">
                    <Coffee className="w-3 h-3" /> Breakfast
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                    <Tv className="w-3 h-3" /> Entertainment
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Types */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-black">Available Rooms</h2>
        <div className="space-y-6">
          {hotelRoomTypes.map((roomType, idx) => {
            const roomAmenitiesList = getRoomAmenities(roomType.room_type_id);
            const colors = ['border-emerald-500', 'border-cyan-500', 'border-purple-500'];
            const priceColors = ['text-emerald-600', 'text-cyan-600', 'text-purple-600'];
            return (
              <Card key={roomType.room_type_id} className={`border-2 ${colors[idx % 3]} bg-white shadow-lg`}>
                <CardContent className="p-6 !bg-white">
                  <div className="flex gap-6">
                    <div className="w-48 h-48 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🛏️</div>
                        <p className="text-sm text-gray-700 font-medium">Room Image</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-black">{roomType.name}</h3>
                          <p className="text-gray-700 mb-3 font-medium">{roomType.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                            <Users className="w-4 h-4 text-emerald-600" />
                            Max {roomType.max_occupancy} guests
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${priceColors[idx % 3]}`}>${roomType.base_price}</p>
                          <p className="text-sm text-gray-600 font-medium">per night</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2 text-black">Room Amenities:</p>
                        <div className="flex flex-wrap gap-2">
                          {roomAmenitiesList.map((amenity) => (
                            <Badge key={amenity.amenity_id} className="bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {amenity.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleBookRoom(roomType.room_type_id)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 font-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-emerald-500 shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-black text-xl font-bold">Complete Your Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-black font-semibold text-sm">Check-in Date</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="text-black bg-white border-2 border-gray-300 focus:border-emerald-500 h-10 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout" className="text-black font-semibold text-sm">Check-out Date</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="text-black bg-white border-2 border-gray-300 focus:border-emerald-500 h-10 text-base"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults" className="text-black font-semibold text-sm">Adults</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="text-black bg-white border-2 border-gray-300 focus:border-emerald-500 h-10 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children" className="text-black font-semibold text-sm">Children</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="text-black bg-white border-2 border-gray-300 focus:border-emerald-500 h-10 text-base"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setIsBookingDialogOpen(false)} 
                className="text-black border-2 border-gray-300 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmBooking} 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-md"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

