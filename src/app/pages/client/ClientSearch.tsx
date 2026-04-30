import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  MapPin, 
  Users, 
  Building2, 
  Loader2, 
  Search, 
  Calendar,
  ChevronRight,
  Star,
  Wifi,
  Waves,
  Coffee,
  CheckCircle2,
  Plane
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function ClientSearch() {
  const { hotels, roomTypes, isLoading } = useBooking();
  const [searchParams] = useSearchParams();
  const [searchCity, setSearchCity] = useState('');
  const [guests] = useState('2');

  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSearchCity(decodeURIComponent(cityParam));
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center bg-stone-100">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-6" />
        <p className="text-stone-900 font-black animate-pulse tracking-wide uppercase text-[10px]">Finding the best properties...</p>
      </div>
    );
  }

  const filteredHotels = searchCity
    ? hotels.filter(h => h.city.toLowerCase().includes(searchCity.toLowerCase()))
    : hotels;

  return (
    <div className="bg-stone-100 min-h-screen -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-300 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-200">
               <Building2 size={22} className="text-emerald-700" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
               Properties in <span className="text-emerald-700">{searchCity || 'All Destinations'}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-black text-stone-900">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-stone-100">
               <Calendar className="w-4 h-4 text-emerald-500" /> Apr 07 — Apr 08
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-stone-100">
               <Users className="w-4 h-4 text-emerald-500" /> {guests} Guests
            </span>
            <span className="text-stone-900">•</span>
            <span className="text-stone-900">{filteredHotels.length} Properties found</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-10 items-start">
        {/* Hotel Cards */}
        <div className="space-y-6">
          {filteredHotels.map((hotel) => {
            const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === hotel.id);
            const minPrice = hotelRoomTypes.length > 0 ? Math.min(...hotelRoomTypes.map(rt => Number(rt.base_price))) : 0;
            const maxOccupancy = hotelRoomTypes.length > 0 ? Math.max(...hotelRoomTypes.map(rt => rt.max_occupancy)) : 0;

            return (
              <div key={hotel.id} className="bg-white rounded-2xl border border-stone-200 shadow-md shadow-stone-200/30 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 overflow-hidden group hover:-translate-y-0.5">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="w-full md:w-80 h-64 md:h-auto bg-stone-200 relative overflow-hidden flex-shrink-0">
                    {hotel.image_url ? (
                      <img 
                        src={hotel.image_url} 
                        alt={hotel.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                        <Building2 size={80} />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-stone-900/70 text-white rounded-full text-[9px] font-bold uppercase tracking-widest py-1 px-3 backdrop-blur-md">Featured</span>
                       <span className="bg-emerald-600 text-white rounded-full text-[9px] font-bold uppercase tracking-widest py-1 px-3 shadow-lg shadow-emerald-500/15">Premium</span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Top Pick</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div className="space-y-5">
                      <div className="flex items-start justify-between">
                         <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">{hotel.name}</h3>
                            <p className="flex items-center gap-1.5 text-xs font-black text-stone-900 mt-2 uppercase tracking-wide">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              {hotel.city} <span className="text-stone-300 mx-1">•</span> {hotel.address}
                            </p>
                         </div>
                         
                         <div className="text-right">
                            <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <span className="text-sm font-bold text-emerald-800">4.8</span>
                              <div className="w-[1px] h-3 bg-emerald-300" />
                              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest leading-none">Exceptional</span>
                            </div>
                            <span className="text-[9px] font-black text-stone-900 mt-2 block uppercase tracking-widest">1,248 Reviews</span>
                         </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                         {[
                           { icon: <Wifi size={12} />, label: 'FREE WIFI' },
                           { icon: <Waves size={12} />, label: 'POOL' },
                           { icon: <Coffee size={12} />, label: 'BREAKFAST' },
                           { icon: <Plane size={12} />, label: 'TRANSFER' },
                         ].map(a => (
                           <div key={a.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 rounded-full text-[10px] font-black text-stone-900 border border-stone-200">
                              <span className="text-emerald-600">{a.icon}</span> {a.label}
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-6 border-t border-stone-200 mt-auto">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs text-stone-900 font-black">
                            <Users className="w-4 h-4 text-stone-900" />
                            Rooms for {maxOccupancy}+ Guests
                         </div>
                         <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                           <CheckCircle2 size={12} strokeWidth={3} /> Instant Confirmation
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] font-black text-stone-900 uppercase tracking-[0.15em] mb-1">From</p>
                            <div className="flex items-baseline gap-1 text-stone-900">
                              <span className="text-lg font-bold">₱</span>
                              <span className="text-3xl font-black tracking-tighter">{minPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-[9px] font-black text-stone-900 uppercase mt-1 tracking-widest">per night</p>
                         </div>
                         <Link to={`/client/hotel/${hotel.id}`}>
                           <Button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95 flex items-center gap-2 group text-xs">
                              Details
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </Button>
                         </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredHotels.length === 0 && (
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 py-32 text-center shadow-md">
              <Building2 className="w-16 h-16 mx-auto mb-6 text-stone-900" />
              <h3 className="text-xl font-black text-stone-950 mb-2">No properties found</h3>
              <p className="text-xs text-stone-900 max-w-xs mx-auto leading-relaxed font-bold">
                Try adjusting filters or exploring different destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
