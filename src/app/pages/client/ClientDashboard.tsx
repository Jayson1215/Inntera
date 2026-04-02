import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, ArrowRight, Search, BedDouble, Clock } from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings: contextBookings, hotels, guests } = useBooking();

  const guest = guests.find(g => g.id === user?.id);
  const userBookings = contextBookings.filter(b => b.guest_id === user?.id);
  const upcomingBookings = userBookings.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'pending');
  const activeBooking = userBookings.find(b => b.booking_status === 'checked-in');
  const guestName = guest ? `${guest.first_name}` : (user?.name || 'Guest');

  return (
    <div className="min-h-[80vh]">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        .fade-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .hero-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); }
        .glass-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); }
      `}</style>

      {/* Hero Section */}
      <div className="fade-up hero-gradient rounded-2xl p-8 md:p-10 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full -ml-10 -mb-10"></div>
        <div className="relative z-10">
          <p className="text-teal-400 text-sm font-semibold tracking-wide mb-2">Welcome back</p>
          <h1 className="text-4xl font-bold mb-2">{guestName} 👋</h1>
          <p className="text-slate-400 text-sm mb-8">
            {upcomingBookings.length > 0 
              ? `You have ${upcomingBookings.length} upcoming ${upcomingBookings.length === 1 ? 'stay' : 'stays'}`
              : 'Ready to plan your next getaway?'
            }
          </p>
          <button
            onClick={() => navigate('/client/search')}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            Find Hotels
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="fade-up grid grid-cols-3 gap-4 mb-8" style={{ animationDelay: '150ms' }}>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{upcomingBookings.length}</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Upcoming Stays</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3">
            <BedDouble className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{userBookings.length}</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeBooking ? '1' : '0'}</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Active Stay</p>
        </div>
      </div>

      {/* Active Stay */}
      {activeBooking && (
        <div className="fade-up mb-8" style={{ animationDelay: '250ms' }}>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Your Active Stay</h2>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">{activeBooking.booking_reference}</p>
                <h3 className="text-xl font-bold mt-1">
                  {activeBooking.hotel?.name || hotels.find(h => h.id === activeBooking.hotel_id)?.name}
                </h3>
                <p className="text-teal-100 text-sm mt-2">
                  Check-out: {new Date(activeBooking.checkout_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <BedDouble className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Bookings */}
      <div className="fade-up" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Upcoming Stays</h2>
          {userBookings.length > 0 && (
            <button onClick={() => navigate('/client/bookings')} className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <h3 className="font-bold text-slate-900 mb-1">No upcoming stays</h3>
            <p className="text-sm text-slate-400 mb-4">Start planning your next adventure!</p>
            <button onClick={() => navigate('/client/search')}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
              <Search className="w-4 h-4" /> Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map(booking => {
              const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
              return (
                <div key={booking.booking_id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate('/client/bookings')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{hotel?.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span>{new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(booking.checkout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="font-mono text-xs text-slate-400">{booking.booking_reference}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {booking.booking_status}
                      </span>
                      {booking.total_cost && (
                        <p className="text-sm font-bold text-slate-900 mt-2">₱{Number(booking.total_cost).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
