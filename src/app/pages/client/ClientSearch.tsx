import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { MapPin, Users, Star } from 'lucide-react';
import { hotels, roomTypes } from '../../data/mockData';

export function ClientSearch() {
  const [searchCity, setSearchCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const filteredHotels = searchCity
    ? hotels.filter(h => h.city.toLowerCase().includes(searchCity.toLowerCase()))
    : hotels;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Hotels</h1>
        <p className="text-gray-500 mt-1">Find your perfect accommodation</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkin">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        {filteredHotels.map((hotel) => {
          const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === hotel.hotel_id);
          const minPrice = Math.min(...hotelRoomTypes.map(rt => rt.base_price));

          return (
            <Card key={hotel.hotel_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏨</div>
                      <p className="text-sm text-gray-600">Hotel Image</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {hotel.address}, {hotel.city}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">From</p>
                        <p className="text-3xl font-bold text-blue-600">${minPrice}</p>
                        <p className="text-sm text-gray-500">per night</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Available Room Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {hotelRoomTypes.map((rt) => (
                          <div key={rt.room_type_id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {rt.name} • ${rt.base_price}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        Up to {Math.max(...hotelRoomTypes.map(rt => rt.max_occupancy))} guests
                      </div>
                      <Link to={`/client/hotel/${hotel.hotel_id}`} className="ml-auto">
                        <Button>View Details & Book</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredHotels.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No hotels found. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

