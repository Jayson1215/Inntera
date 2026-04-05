import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, Clock, Search, BedDouble, CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export function ClientBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings: contextBookings, hotels } = useBooking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('all');
  const highlightedId = location.state?.highlightedBookingId;
  const bookingRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const userBookings = contextBookings.filter(b => b.guest_id === user?.id);

  useEffect(() => {
    if (highlightedId && bookingRefs.current[highlightedId]) {
      bookingRefs.current[highlightedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId, userBookings]);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'checked-in'].includes(b.booking_status);
    if (activeTab === 'past') return ['checked-out', 'cancelled'].includes(b.booking_status);
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmed' };
      case 'checked-in': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Checked In' };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' };
      case 'checked-out': return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: status };
    }
  };

  const getNights = (checkin: string, checkout: string) => {
    const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">My Bookings</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            {userBookings.length} TOTAL {userBookings.length === 1 ? 'RESERVATION' : 'RESERVATIONS'}
          </p>
        </div>
        
        {/* Modern Segmented Control for Tabs */}
        <div className="bg-gray-100 p-1 rounded-xl flex w-full md:w-auto shadow-inner">
          {(['all', 'upcoming', 'past'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-white text-black shadow-md scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 py-20 px-6 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-200" />
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              No stays found here
            </h2>
            <p className="text-gray-500 font-bold text-sm mb-8 max-w-xs mx-auto">
              Your itinerary is currently empty in this category. Ready for a new checkout?
            </p>
            <Button 
              onClick={() => navigate('/client/search')}
              className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl active:scale-95 transition-all text-xs"
            >
              <Search className="w-4 h-4 mr-2" /> Start Browsing
            </Button>
          </div>
        ) : (
          filteredBookings.map((booking, index) => {
            const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
            const status = getStatusStyles(booking.booking_status);
            const nights = getNights(booking.checkin_date, booking.checkout_date);
            const bookingRooms = booking.booking_rooms || [];

            return (
              <div 
                key={booking.booking_id} 
                ref={el => bookingRefs.current[booking.booking_id] = el}
                className={cn(
                  "bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-black transition-all group",
                  highlightedId === booking.booking_id && "ring-4 ring-emerald-400 ring-offset-4 shadow-2xl scale-[1.01] border-emerald-500"
                )}
              >
                <div className="p-1">
                   <div className={`h-1.5 w-full rounded-t-full ${status.bg} border-b ${status.border}`} />
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    {/* Hotel Info Section */}
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                        <MapPin className="w-7 h-7 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                             {status.label}
                           </span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             REF: {booking.booking_reference}
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">{hotel?.name || 'Inntera Hotel'}</h3>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{hotel?.city} • {hotel?.address}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-xs font-black uppercase tracking-widest text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-500" />
                            {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(booking.checkout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {nights} {nights === 1 ? 'NIGHT' : 'NIGHTS'}
                          </div>
                          <div className="flex items-center gap-2">
                             <BedDouble className="w-4 h-4 text-gray-400" />
                             {bookingRooms.length} {bookingRooms.length === 1 ? 'UNIT' : 'UNITS'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Section */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-100">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Valuation</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-2xl font-black text-gray-900 leading-none">₱{Number(booking.total_cost).toLocaleString()}</span>
                          <ChevronRight className="w-5 h-5 text-gray-300 lg:hidden" />
                        </div>
                        {booking.payments && booking.payments.length > 0 && (
                          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-2">
                            <CreditCard className="w-3 h-3" />
                            Paid Completed
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost"
                        className="hidden lg:flex mt-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 active:scale-95"
                      >
                        Manage Reservation
                      </Button>
                    </div>
                  </div>

                  {/* Room Details Sub-section */}
                  {bookingRooms.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Confirmed Units</p>
                      <div className="flex flex-wrap gap-2">
                        {bookingRooms.map((br: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Room {br.room?.room_number || br.room_id}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                               {br.adults_count} ADL {br.children_count > 0 && `• ${br.children_count} CHD`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
