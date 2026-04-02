import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, Clock, Search, BedDouble, CreditCard } from 'lucide-react';

export function ClientBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings: contextBookings, hotels } = useBooking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('all');

  const userBookings = contextBookings.filter(b => b.guest_id === user?.id);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'checked-in'].includes(b.booking_status);
    if (activeTab === 'past') return ['checked-out', 'cancelled'].includes(b.booking_status);
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmed' };
      case 'checked-in': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Checked In' };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'checked-out': return { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  const getNights = (checkin: string, checkout: string) => {
    const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-[80vh]">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1">{userBookings.length} total {userBookings.length === 1 ? 'booking' : 'bookings'}</p>
      </div>

      {/* Tabs */}
      <div className="fade-up flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit" style={{ animationDelay: '100ms' }}>
        {(['all', 'upcoming', 'past'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'upcoming' && userBookings.filter(b => ['confirmed', 'pending', 'checked-in'].includes(b.booking_status)).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                {userBookings.filter(b => ['confirmed', 'pending', 'checked-in'].includes(b.booking_status)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="fade-up bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center" style={{ animationDelay: '200ms' }}>
          <Calendar className="w-14 h-14 mx-auto mb-4 text-slate-200" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {activeTab === 'upcoming' ? 'No upcoming stays' : activeTab === 'past' ? 'No past stays' : 'No bookings yet'}
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            {activeTab === 'upcoming' ? 'Your next adventure awaits!' : 'Start exploring hotels and make your first reservation'}
          </p>
          <button onClick={() => navigate('/client/search')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            <Search className="w-4 h-4" /> Browse Hotels
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => {
            const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
            const status = getStatusStyles(booking.booking_status);
            const nights = getNights(booking.checkin_date, booking.checkout_date);
            const bookingRooms = booking.booking_rooms || [];

            return (
              <div key={booking.booking_id} className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                style={{ animationDelay: `${200 + index * 80}ms` }}>
                {/* Top accent bar */}
                <div className={`h-1 ${booking.booking_status === 'confirmed' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : booking.booking_status === 'checked-in' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : booking.booking_status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-slate-200'}`}></div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{hotel?.name || 'Hotel'}</h3>
                        <p className="text-sm text-slate-400">{hotel?.city} • {hotel?.address}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(booking.checkout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {nights} {nights === 1 ? 'night' : 'nights'}
                          </div>
                          {bookingRooms.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                              {bookingRooms.length} {bookingRooms.length === 1 ? 'room' : 'rooms'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{booking.booking_reference}</span>
                      {booking.total_cost && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-lg font-bold text-slate-900">₱{Number(booking.total_cost).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room details */}
                  {bookingRooms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        {bookingRooms.map((br: any, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 text-sm text-slate-600 border border-slate-100">
                            Room {br.room?.room_number || br.room_id} • {br.adults_count} {br.adults_count === 1 ? 'adult' : 'adults'}
                            {br.children_count > 0 && `, ${br.children_count} ${br.children_count === 1 ? 'child' : 'children'}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment info */}
                  {booking.payments && booking.payments.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <CreditCard className="w-3 h-3" />
                      Paid via {booking.payments[0].payment_method} • {booking.payments[0].status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
