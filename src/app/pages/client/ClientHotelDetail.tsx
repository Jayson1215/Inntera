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
      <div className="h-[70vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-black animate-pulse uppercase tracking-widest text-[10px] text-stone-900">Preparing the finest suites...</p>
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
        <p className="text-stone-900 mb-8 font-black uppercase tracking-widest text-[10px]">This destination seems to be off the map for now.</p>
        <Button onClick={() => navigate('/client/search')} className="bg-emerald-600 hover:bg-emerald-700 px-8 h-12 rounded-xl text-white">
          Back to Search
        </Button>
      </div>
    );
  }

  const handleBookRoom = (roomTypeId: number) => {
    navigate(`/client/reserve/${hotelId}/${roomTypeId}`);
  };

  return (
    <div className="bg-stone-200 -mt-8 -mx-4 md:-mx-8 lg:-mx-12 min-h-screen px-4 md:px-8 lg:px-12 py-8">
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
               <Badge className="bg-emerald-600 text-white border-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20">360° Tour</Badge>
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
                <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg text-emerald-600 border border-emerald-100">
                   <Star className="w-3.5 h-3.5 fill-current" />
                   <span className="text-xs font-bold">4.9/5</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.15em] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Premium Collection</span>
             </div>
             <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">{hotel.name}</h1>
             <div className="flex items-center gap-6 text-sm font-black text-stone-900">
                <div className="flex items-center gap-1.5">
                   <MapPin className="w-4 h-4 text-emerald-500" />
                   {hotel.address}, {hotel.city}
                </div>
                <div className="flex items-center gap-1.5">
                   <Phone className="w-4 h-4 text-stone-900" />
                   {hotel.phone}
                </div>
             </div>
          </div>
          <div className="w-full md:w-auto flex flex-col items-end">
             <div className="text-right mb-4">
                <span className="text-xs font-black text-stone-900 uppercase tracking-widest block mb-1">Starting Rate</span>
                <div className="flex items-baseline gap-1">
                   <span className="text-xs font-black text-stone-900">₱</span>
                   <span className="text-4xl font-black text-stone-900 tracking-tighter">
                      {hotelRoomTypes.length > 0 ? Math.min(...hotelRoomTypes.map(rt => Number(rt.base_price))).toLocaleString() : '---'}
                   </span>
                   <span className="text-xs font-black text-stone-900 uppercase tracking-widest text-[10px] ml-1">/night</span>
                </div>
             </div>
             <Button className="w-full md:w-auto h-14 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/15 active:scale-95 transition-all">
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
             <h3 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] mb-6">World-Class Facilities</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Wifi />, label: 'High-Speed WiFi' },
                  { icon: <Coffee />, label: 'Craft Breakfast' },
                  { icon: <Users />, label: 'Family Friendly' },
                  { icon: <Tv />, label: 'HD Entertainment' }
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-stone-50 hover:bg-emerald-50 transition-all group border border-stone-100 hover:border-emerald-200">
                    <div className="text-emerald-600 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black text-stone-900 uppercase tracking-wider text-center">{item.label}</span>
                  </div>
                ))}
             </div>
           </section>

           {/* Room Types */}
           <section>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">Available Rooms</h2>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 font-bold uppercase tracking-widest text-[9px] bg-emerald-50">{hotelRoomTypes.length} OPTIONS</Badge>
             </div>
             
             <div className="space-y-4">
                {hotelRoomTypes.map((roomType) => {
                  const representativeRoom = rooms.find(r => r.room_type_id === roomType.room_type_id && r.hotel_id === hotel.id);
                  return (
                    <Card key={roomType.room_type_id} className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-500">
                      <CardContent className="p-2 md:p-3">
                        <div className="flex flex-col md:flex-row bg-white h-full">
                          <div className="w-full md:w-64 h-56 md:h-auto rounded-[1.25rem] bg-stone-100 flex items-center justify-center relative flex-shrink-0 overflow-hidden">
                             {roomType.image_url ? (
                               <img src={roomType.image_url} alt={roomType.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                             ) : (
                               <div className="text-6xl opacity-20">🛏️</div>
                             )}
                             <div className="absolute top-4 left-4">
                                <Badge className="bg-white/95 backdrop-blur-md text-stone-900 flex items-center justify-center rounded-full border-0 text-[10px] font-black uppercase tracking-widest px-3 shadow-md shadow-black/5">Level {representativeRoom?.floor || '0'}</Badge>
                             </div>
                          </div>
                          
                          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                             <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                                <div>
                                   <h4 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-emerald-700 transition-colors">{roomType.name}</h4>
                                   <div className="flex items-center gap-3 text-[11px] font-black text-stone-900 uppercase tracking-widest mt-2">
                                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {roomType.max_occupancy} Guests</span>
                                      <span className="w-1 h-1 bg-stone-900 rounded-full" />
                                      <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {roomType.bed_type}</span>
                                   </div>
                                </div>
                                <div className="text-left md:text-right">
                                   <p className="flex items-baseline md:justify-end gap-0.5">
                                      <span className="text-stone-900 text-lg font-black">₱</span>
                                      <span className="text-3xl font-black text-stone-900 tracking-tighter shadow-sm">{Number(roomType.base_price).toLocaleString()}</span>
                                   </p>
                                   <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest mt-0.5">per night</p>
                                </div>
                             </div>

                             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-stone-100">
                                <div className="flex flex-col gap-2">
                                   <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Included Amenities</p>
                                   <div className="flex flex-wrap gap-2">
                                      {['Daily Cleaning', 'Free Parking', 'Welcome Drink'].map(inc => (
                                        <span key={inc} className="text-[10px] font-black text-stone-900 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">{inc}</span>
                                      ))}
                                   </div>
                                </div>
                                <Button 
                                  onClick={() => handleBookRoom(roomType.room_type_id)}
                                  className="w-full md:w-auto h-12 px-8 bg-stone-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-xl text-[11px] transition-all active:scale-[0.98] shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2 group/btn"
                                >
                                  Reserve Suite <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
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
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] mb-5">Property Policies</h3>
              <div className="space-y-5">
                 <div>
                    <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest mb-1">Check-in Time</p>
                    <p className="text-sm font-black text-stone-900">14:00 PM — 10:00 PM</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest mb-1">Check-out Time</p>
                    <p className="text-sm font-black text-stone-900">Until 12:00 PM</p>
                 </div>
                 <div className="pt-4 border-t border-stone-50">
                    <p className="text-[11px] text-stone-900 leading-relaxed font-black italic">"A strictly non-smoking property. Pets are not permitted unless specified."</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
