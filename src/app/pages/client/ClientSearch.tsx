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
      <div className="h-[70vh] flex flex-col items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600 mb-6" />
        <p className="text-stone-500 font-medium animate-pulse tracking-wide">Finding the best properties...</p>
      </div>
    );
  }

  const filteredHotels = searchCity
    ? hotels.filter(h => h.city.toLowerCase().includes(searchCity.toLowerCase()))
    : hotels;

  return (
    <div className="bg-[#FAFAF8] min-h-screen -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-200/60 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
               <Building2 size={22} className="text-amber-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
               Properties in <span className="text-amber-700">{searchCity || 'All Destinations'}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-stone-500">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-stone-100">
               <Calendar className="w-4 h-4 text-amber-500" /> Apr 07 — Apr 08
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-stone-100">
               <Users className="w-4 h-4 text-amber-500" /> {guests} Guests
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-600">{filteredHotels.length} Properties found</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-8 lg:sticky lg:top-28">
          <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/20 rounded-full -mr-8 -mt-8" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-stone-700 mb-8 pb-4 border-b border-stone-100">Refine Search</h3>
            
            <div className="space-y-10">
              {/* Location */}
              <div className="space-y-4">
                <Label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Destination</Label>
                <div className="relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
                   <Input 
                    placeholder="Search city..." 
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-12 h-14 bg-stone-50 border-stone-100 rounded-2xl font-medium text-sm focus:ring-amber-500 focus:border-amber-200 transition-all"
                   />
                </div>
              </div>

              {/* Guest Rating Filter */}
              <div className="space-y-4 pt-6 border-t border-stone-50">
                <Label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Guest Rating</Label>
                <div className="space-y-3">
                  {[
                    { label: 'Excellent', rating: '4.5+', count: '24' },
                    { label: 'Very Good', rating: '4.0+', count: '108' },
                    { label: 'Good', rating: '3.5+', count: '41' }
                  ].map((r) => (
                    <label key={r.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 cursor-pointer group transition-colors border border-stone-100 hover:border-amber-200">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded border border-stone-300 group-hover:border-amber-400 transition-colors bg-white" />
                        <span className="text-sm font-medium text-stone-900 group-hover:text-stone-900 transition-colors">{r.rating} {r.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">{r.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Best Price</p>
                <p className="text-xs text-stone-900 leading-relaxed font-medium">Prices drop when you book within the next 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Cards */}
        <div className="lg:col-span-3 space-y-6">
          {filteredHotels.map((hotel) => {
            const hotelRoomTypes = roomTypes.filter(rt => rt.hotel_id === hotel.id);
            const minPrice = hotelRoomTypes.length > 0 ? Math.min(...hotelRoomTypes.map(rt => Number(rt.base_price))) : 0;
            const maxOccupancy = hotelRoomTypes.length > 0 ? Math.max(...hotelRoomTypes.map(rt => rt.max_occupancy)) : 0;

            return (
              <div key={hotel.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-200 transition-all duration-300 overflow-hidden group hover:-translate-y-0.5">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="w-full md:w-80 h-64 md:h-auto bg-stone-100 relative overflow-hidden flex-shrink-0">
                    {hotel.image_url ? (
                      <img 
                        src={hotel.image_url} 
                        alt={hotel.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-200">
                        <Building2 size={80} />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-stone-900/70 text-white rounded-full text-[9px] font-bold uppercase tracking-widest py-1 px-3 backdrop-blur-md">Featured</span>
                       <span className="bg-amber-600 text-white rounded-full text-[9px] font-bold uppercase tracking-widest py-1 px-3 shadow-lg shadow-amber-500/15">Premium</span>
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
                            <h3 className="text-2xl font-bold text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors leading-tight">{hotel.name}</h3>
                            <p className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mt-2 uppercase tracking-wide">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              {hotel.city} <span className="text-stone-200 mx-1">•</span> {hotel.address}
                            </p>
                         </div>
                         
                         <div className="text-right">
                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                              <span className="text-sm font-bold text-emerald-700">4.8</span>
                              <div className="w-[1px] h-3 bg-emerald-200" />
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Exceptional</span>
                            </div>
                            <span className="text-[9px] font-medium text-stone-400 mt-2 block uppercase tracking-widest">1,248 Reviews</span>
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
                           <div key={a.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 rounded-full text-[10px] font-medium text-stone-600 border border-stone-100">
                              <span className="text-amber-500">{a.icon}</span> {a.label}
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-6 border-t border-stone-50 mt-auto">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                            <Users className="w-4 h-4 text-stone-400" />
                            Rooms for {maxOccupancy}+ Guests
                         </div>
                         <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                           <CheckCircle2 size={12} strokeWidth={3} /> Instant Confirmation
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.15em] mb-1">From</p>
                            <div className="flex items-baseline gap-1 text-stone-900">
                              <span className="text-lg font-bold">₱</span>
                              <span className="text-3xl font-black tracking-tighter">{minPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-[9px] font-medium text-stone-400 uppercase mt-1 tracking-widest">per night</p>
                         </div>
                         <Link to={`/client/hotel/${hotel.id}`}>
                           <Button className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-amber-500/10 active:scale-95 flex items-center gap-2 group text-xs">
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
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 py-32 text-center shadow-sm">
              <Building2 className="w-16 h-16 mx-auto mb-6 text-stone-200" />
              <h3 className="text-xl font-bold text-stone-900 mb-2">No properties found</h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Try adjusting filters or exploring different destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
