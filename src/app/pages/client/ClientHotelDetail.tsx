import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, Phone, Star, Users, Wifi, Coffee, Tv, Layers, Loader2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function ClientHotelDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { hotels, roomTypes, rooms, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Preparing the finest suites...</p>
      </div>
    );
  }

  const hotel = hotels.find(h => h.id === parseInt(hotelId || '0'));
  const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === parseInt(hotelId || '0'));

  if (!hotel) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="text-6xl mb-4">🏙️</div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Hotel Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">This luxury destination seems to be off the map for now.</p>
        <Button onClick={() => navigate('/client/search')} className="bg-slate-900 hover:bg-slate-800 px-8 h-12 rounded-xl">
          Back to Search
        </Button>
      </div>
    );
  }

  const handleBookRoom = (roomTypeId: number) => {
    navigate(`/client/reserve/${hotelId}/${roomTypeId}`);
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
                  <h1 className="text-3xl font-bold mb-2 text-black font-serif">{hotel.name}</h1>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(hotel.star_rating || 5)].map((_, i) => (
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
            const roomAmenitiesList = roomType.amenities || [];
            const representativeRoom = rooms.find(r => r.room_type_id === roomType.room_type_id && r.hotel_id === parseInt(hotelId || '0'));
            const colors = ['border-emerald-500', 'border-cyan-500', 'border-purple-500'];
            const priceColors = ['text-emerald-600', 'text-cyan-600', 'text-purple-600'];
            const bgBadgeColors = ['bg-emerald-50', 'bg-cyan-50', 'bg-purple-50'];
            
            return (
              <Card key={roomType.room_type_id} className={`border-2 ${colors[idx % 3]} bg-white shadow-lg overflow-hidden`}>
                <CardContent className="p-0 !bg-white">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 h-64 bg-slate-100 flex items-center justify-center relative">
                      <div className="text-6xl text-slate-300">🛏️</div>
                      {representativeRoom && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-black/80 text-white border-0 py-1 px-3 rounded-full flex items-center gap-2">
                            <Layers size={12} />
                            Floor {representativeRoom.floor}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{roomType.name}</h3>
                            {representativeRoom && (
                              <Badge variant="outline" className={`${priceColors[idx % 3]} border-current font-bold`}>
                                Room {representativeRoom.room_number}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                            {roomType.description}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className={`text-4xl font-black ${priceColors[idx % 3]} tracking-tighter`}>₱{Number(roomType.base_price).toLocaleString()}</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Per Night</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Key Features</p>
                          <div className="flex items-center gap-4 text-slate-700 font-semibold bg-slate-50 p-4 rounded-2xl">
                             <div className="flex items-center gap-2">
                               <Users size={18} className="text-slate-400" />
                               <span>Up to {roomType.max_occupancy} Guests</span>
                             </div>
                             <div className="w-[1px] h-4 bg-slate-200"></div>
                             <div className="flex items-center gap-2">
                               <div className="text-slate-400">🛏️</div>
                               <span>{roomType.bed_type} Bed</span>
                             </div>
                             <div className="w-[1px] h-4 bg-slate-200"></div>
                             <div className="flex items-center gap-2">
                               <Layers size={18} className="text-slate-400" />
                               <span>Level {representativeRoom?.floor || 'N/A'}</span>
                             </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Included Amenities</p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl">
                            {roomType.amenities_summary || 'Complimentary premium facilities included.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {roomAmenitiesList.slice(0, 5).map((amenity: any) => (
                          <Badge key={amenity.amenity_id} className={`${bgBadgeColors[idx % 3]} ${priceColors[idx % 3]} border-0 font-bold px-3 py-1 rounded-lg`}>
                            {amenity.name}
                          </Badge>
                        ))}
                        {roomAmenitiesList.length > 5 && (
                          <Badge className="bg-slate-100 text-slate-500 border-0 font-bold px-3 py-1 rounded-lg">
                            +{roomAmenitiesList.length - 5} More
                          </Badge>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleBookRoom(roomType.room_type_id)}
                        className={`w-full md:w-auto h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xl shadow-slate-200`}
                      >
                        Reserve This Suite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}

