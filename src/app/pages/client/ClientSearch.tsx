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
            <Card key={hotel.id} className="hover:shadow-lg transition-all border-2 border-cyan-500 bg-white overflow-hidden group">
              <CardContent className="p-0 bg-white">
                <div className="flex flex-col md:flex-row">
                  {/* Image Placeholder */}
                  <div className="w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-emerald-100 to-cyan-100 flex flex-col items-center justify-center relative overflow-hidden">
                    <Building2 className="w-16 h-16 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest">Inntera Property</p>
                    <div className="absolute top-4 left-4 bg-black/80 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      Featured
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1 text-gray-900 uppercase tracking-tighter">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm font-bold">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {hotel.address}, {hotel.city}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs font-bold text-gray-500 ml-2">(4.8 / 5.0)</span>
                        </div>
                      </div>
                      <div className="w-full md:w-auto p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center md:text-right">
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Starting from</p>
                        <div className="flex items-baseline justify-center md:justify-end gap-1">
                          <span className="text-3xl font-black text-gray-900">${minPrice}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase">/ night</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Available Accommodations</p>
                      <div className="flex flex-wrap gap-2">
                        {hotelRoomTypes.map((rt) => (
                          <div key={rt.room_type_id} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 font-bold shadow-sm hover:border-emerald-300 transition-colors">
                            {rt.name} • ${rt.base_price}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-bold uppercase tracking-tight">
                        <Users className="w-4 h-4 text-emerald-600" />
                        Up to {maxOccupancy} guests
                      </div>
                      <Link to={`/client/hotel/${hotel.id}`} className="w-full sm:w-auto sm:ml-auto">
                        <Button className="w-full bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs py-5 rounded-xl shadow-lg active:scale-95 transition-all">
                          Check Availability
                        </Button>
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

