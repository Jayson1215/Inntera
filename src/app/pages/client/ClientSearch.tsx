import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { MapPin, Users, Star, Building2, Loader2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function ClientSearch() {
  const { hotels, roomTypes, isLoading } = useBooking();
  const [searchParams] = useSearchParams();
  const [searchCity, setSearchCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Initialize search city from query parameter
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSearchCity(decodeURIComponent(cityParam));
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Finding the best hotels for you...</p>
      </div>
    );
  }

  const filteredHotels = searchCity
    ? hotels.filter(h => h.city.toLowerCase().includes(searchCity.toLowerCase()))
    : hotels;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black font-serif">Search Hotels</h1>
        <p className="text-gray-700 mt-1">Find your perfect accommodation in {searchCity || 'all cities'}</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8 border-2 border-emerald-500 bg-white">
        <CardContent className="p-6 bg-white">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-black font-semibold">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="text-black bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-black font-semibold">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="text-black bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout" className="text-black font-semibold">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="text-black bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-black font-semibold">Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="text-black bg-white border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        {filteredHotels.map((hotel) => {
          const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === hotel.id);
          const minPrice = hotelRoomTypes.length > 0 ? Math.min(...hotelRoomTypes.map(rt => Number(rt.base_price))) : 0;
          const maxOccupancy = hotelRoomTypes.length > 0 ? Math.max(...hotelRoomTypes.map(rt => rt.max_occupancy)) : 0;

          return (
            <Card key={hotel.id} className="hover:shadow-lg transition-shadow border-2 border-cyan-500 bg-white">
              <CardContent className="p-6 bg-white">
                <div className="flex gap-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-700 font-semibold">Hotel Image</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold mb-2 text-black">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-gray-800 mb-2">
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
                        <p className="text-sm text-gray-700">From</p>
                        <p className="text-3xl font-bold text-emerald-600">${minPrice}</p>
                        <p className="text-sm text-gray-700">per night</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-900 mb-2 font-semibold">Available Room Types:</p>
                      <div className="flex flex-wrap gap-2">
                        {hotelRoomTypes.map((rt) => (
                          <div key={rt.room_type_id} className="px-3 py-1 bg-emerald-100 rounded-full text-sm text-black font-medium">
                            {rt.name} • ${rt.base_price}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                        <Users className="w-4 h-4" />
                        Up to {maxOccupancy} guests
                      </div>
                      <Link to={`/client/hotel/${hotel.id}`} className="ml-auto">
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
        <Card className="border-2 border-gray-300 bg-white">
          <CardContent className="p-12 text-center">
            <p className="text-gray-700 font-medium">No hotels found. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

