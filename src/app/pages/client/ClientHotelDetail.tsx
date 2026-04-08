import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, Phone, Star, Users, Wifi, Coffee, Tv, Layers, Loader2, ChevronRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function ClientHotelDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { hotels, roomTypes, rooms, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-amber-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Preparing the finest suites...</p>
      </div>
    );
  }

  const hotel = hotels.find(h => h.id === parseInt(hotelId || '0'));
  const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === parseInt(hotelId || '0'));

  if (!hotel) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-stone-200">
        <div className="text-6xl mb-4">🏙️</div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Hotel Not Found</h2>
        <p className="text-stone-600 mb-8 font-medium">This destination seems to be off the map for now.</p>
        <Button onClick={() => navigate('/client/search')} className="bg-amber-600 hover:bg-amber-700 px-8 h-12 rounded-xl text-white">
          Back to Search
        </Button>
      </div>
    );
  }

  const handleBookRoom = (roomTypeId: number) => {
    navigate(`/client/reserve/${hotelId}/${roomTypeId}`);
  };

  return (
    <div className="bg-[#FAFAF8] -mt-8 -mx-4 md:-mx-8 lg:-mx-12 min-h-screen px-4 md:px-8 lg:px-12 py-8">
      {/* Hotel Hero Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-8 border border-stone-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[400px]">
          <div className="lg:col-span-2 bg-stone-100 flex items-center justify-center relative overflow-hidden">
            {hotel.image_url ? (
              <img 
                src={hotel.image_url} 
                alt={hotel.name} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : (
              <div className="text-9xl opacity-10">🏨</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 flex gap-2">
               <Badge className="bg-black/50 backdrop-blur-md text-white border-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">View Gallery</Badge>
               <Badge className="bg-amber-600 text-white border-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">360° Tour</Badge>
            </div>
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-px bg-stone-100">
            <div className="bg-stone-50 flex items-center justify-center relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="pool" className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500" />
               <span className="relative z-10 text-white font-bold uppercase tracking-widest text-[10px] drop-shadow-lg bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Pool Deck</span>
            </div>
            <div className="bg-stone-50 flex items-center justify-center relative overflow-hidden">
               <img src="https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="dining" className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500" />
               <span className="relative z-10 text-white font-bold uppercase tracking-widest text-[10px] drop-shadow-lg bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Dining Hub</span>
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-600 border border-amber-100">
                   <Star className="w-3.5 h-3.5 fill-current" />
                   <span className="text-xs font-bold">4.9/5</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.15em] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">Premium Collection</span>
             </div>
             <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">{hotel.name}</h1>
             <div className="flex items-center gap-6 text-sm font-medium text-stone-500">
                <div className="flex items-center gap-1.5 text-stone-600">
                   <MapPin className="w-4 h-4 text-amber-500" />
                   {hotel.address}, {hotel.city}
                </div>
                <div className="flex items-center gap-1.5">
                   <Phone className="w-4 h-4 text-stone-400" />
                   {hotel.phone}
                </div>
             </div>
          </div>
          <div className="w-full md:w-auto flex flex-col items-end">
             <div className="text-right mb-4">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-widest block mb-1">Starting Rate</span>
                <div className="flex items-baseline gap-1">
                   <span className="text-xs font-bold text-stone-600">₱</span>
                   <span className="text-4xl font-black text-stone-900 tracking-tighter">
                      {hotelRoomTypes.length > 0 ? Math.min(...hotelRoomTypes.map(rt => Number(rt.base_price))).toLocaleString() : '---'}
                   </span>
                   <span className="text-xs font-medium text-stone-600">/night</span>
                </div>
             </div>
             <Button className="w-full md:w-auto h-14 px-12 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/15 active:scale-95 transition-all">
                Select Your Suite
             </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Amenities Summary */}
           <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
             <h3 className="text-xs font-bold text-stone-600 uppercase tracking-[0.2em] mb-6">World-Class Facilities</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Wifi />, label: 'High-Speed WiFi' },
                  { icon: <Coffee />, label: 'Craft Breakfast' },
                  { icon: <Users />, label: 'Family Friendly' },
                  { icon: <Tv />, label: 'HD Entertainment' }
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-stone-50 hover:bg-amber-50 transition-all group border border-stone-100 hover:border-amber-200">
                    <div className="text-amber-600 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-center">{item.label}</span>
                  </div>
                ))}
             </div>
           </section>

           {/* Room Types */}
           <section>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">Available Rooms</h2>
                <Badge variant="outline" className="border-amber-200 text-amber-700 font-bold uppercase tracking-widest text-[9px] bg-amber-50">{hotelRoomTypes.length} OPTIONS</Badge>
             </div>
             
             <div className="space-y-4">
                {hotelRoomTypes.map((roomType) => {
                  const representativeRoom = rooms.find(r => r.room_type_id === roomType.room_type_id && r.hotel_id === hotel.id);
                  return (
                    <Card key={roomType.room_type_id} className="bg-white border border-stone-100 overflow-hidden shadow-sm group hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-56 h-48 md:h-auto bg-stone-50 flex items-center justify-center relative flex-shrink-0">
                             <div className="text-6xl opacity-10">🛏️</div>
                             <div className="absolute top-4 left-4">
                                <Badge className="bg-stone-800 text-white rounded-full border-0 text-[9px] font-bold uppercase tracking-wider px-3">Level {representativeRoom?.floor || '0'}</Badge>
                             </div>
                          </div>
                          
                          <div className="flex-1 p-6 flex flex-col justify-between">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                   <h4 className="text-lg font-bold text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors">{roomType.name}</h4>
                                   <div className="flex items-center gap-3 text-[10px] font-medium text-stone-600 uppercase tracking-widest mt-1.5">
                                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {roomType.max_occupancy} Guests</span>
                                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {roomType.bed_type}</span>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-stone-900 tracking-tighter">₱{Number(roomType.base_price).toLocaleString()}</p>
                                   <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">per night</p>
                                </div>
                             </div>

                             <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                <div className="flex flex-wrap gap-2">
                                   {['Daily Cleaning', 'Free Parking', 'Welcome Drink'].map(inc => (
                                     <span key={inc} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{inc}</span>
                                   ))}
                                </div>
                                <Button 
                                  onClick={() => handleBookRoom(roomType.room_type_id)}
                                  className="h-10 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-xl text-[10px] transition-all active:scale-95 shadow-md shadow-amber-500/10 flex items-center gap-2"
                                >
                                  Reserve <ChevronRight size={14} />
                                </Button>
                             </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
             </div>
           </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-[0.2em] mb-5">Property Policies</h3>
              <div className="space-y-5">
                 <div>
                    <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-1">Check-in Time</p>
                    <p className="text-sm font-bold text-stone-700">14:00 PM — 10:00 PM</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-1">Check-out Time</p>
                    <p className="text-sm font-bold text-stone-700">Until 12:00 PM</p>
                 </div>
                 <div className="pt-4 border-t border-stone-50">
                    <p className="text-[11px] text-stone-600 leading-relaxed italic">"A strictly non-smoking property. Pets are not permitted unless specified."</p>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl shadow-amber-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                 <h3 className="text-xl font-black tracking-tight mb-2">Best Price Guarantee</h3>
                 <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">Book with confidence. We guarantee the best value for your stay.</p>
                 <Button className="w-full bg-white text-amber-700 hover:bg-amber-50 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg">
                   Join Rewards
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
