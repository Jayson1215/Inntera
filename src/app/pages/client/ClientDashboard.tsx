import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, ArrowRight, Search, BedDouble, Clock, Star, Sparkles, Shield, Globe, ChevronRight, Hotel } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings: contextBookings, hotels, guests } = useBooking();
  const [greeting, setGreeting] = useState('Good evening');

  const guest = guests.find(g => g.id === user?.id);
  const userBookings = contextBookings.filter(b => b.guest_id === user?.id);
  const upcomingBookings = userBookings.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'pending');
  const activeBooking = userBookings.find(b => b.booking_status === 'checked-in');
  const completedBookings = userBookings.filter(b => b.booking_status === 'checked-out');
  const guestName = guest ? `${guest.first_name}` : (user?.name?.split(' ')[0] || 'Guest');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const totalNights = userBookings.reduce((acc, b) => {
    const checkin = new Date(b.checkin_date);
    const checkout = new Date(b.checkout_date);
    return acc + Math.max(1, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
  }, 0);

  return (
    <div className="bg-[#FAFAF8] -mt-8 -mx-4 md:-mx-8 lg:-mx-12 min-h-screen px-4 md:px-8 lg:px-12 py-8 font-sans">
      
      {/* Welcome Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-stone-50 to-amber-50/30 border border-stone-100 shadow-sm">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-amber-500/15">
              {guestName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-amber-600/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">{greeting}</p>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">{guestName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200/60">
                  <Sparkles size={10} className="inline mr-1" />Diamond Member
                </span>
                <span className="text-stone-200 text-xs">•</span>
                <span className="text-stone-600 text-xs font-medium">{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-1">Total Stays</p>
              <p className="text-3xl font-black text-stone-900">{userBookings.length}</p>
            </div>
            <div className="w-px bg-stone-100"></div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-1">Nights</p>
              <p className="text-3xl font-black text-amber-600">{totalNights}</p>
            </div>
            <div className="w-px bg-stone-100"></div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-1">Completed</p>
              <p className="text-3xl font-black text-stone-900">{completedBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Stay */}
          {activeBooking && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider">Currently Checked In</h2>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-200/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">{activeBooking.booking_reference}</p>
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-4">
                      {activeBooking.hotel?.name || hotels.find(h => h.id === activeBooking.hotel_id)?.name}
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                        <Calendar size={14} className="text-emerald-500" />
                        Ends {new Date(activeBooking.checkout_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                        <MapPin size={14} className="text-emerald-500" />
                        {hotels.find(h => h.id === activeBooking.hotel_id)?.city}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/client/bookings')}
                    className="h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest rounded-xl text-[10px] transition-all active:scale-95 shadow-lg shadow-emerald-500/15"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/client/search')}
              className="group p-6 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 transition-all duration-300 text-left hover:shadow-md hover:shadow-amber-500/5"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 border border-amber-100 group-hover:border-amber-500">
                <Search className="text-amber-600 group-hover:text-white" size={20} />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Search Hotels</h3>
              <p className="text-[10px] text-stone-600 font-medium">Browse available stays</p>
            </button>
            <button
              onClick={() => navigate('/client/bookings')}
              className="group p-6 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 transition-all duration-300 text-left hover:shadow-md hover:shadow-amber-500/5"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 border border-amber-100 group-hover:border-amber-500">
                <Calendar className="text-amber-600 group-hover:text-white" size={20} />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">My Bookings</h3>
              <p className="text-[10px] text-stone-600 font-medium">Manage reservations</p>
            </button>
            <button
              onClick={() => navigate('/client/search')}
              className="group p-6 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 transition-all duration-300 text-left hover:shadow-md hover:shadow-amber-500/5"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 border border-amber-100 group-hover:border-amber-500">
                <BedDouble className="text-amber-600 group-hover:text-white" size={20} />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Explore Suites</h3>
              <p className="text-[10px] text-stone-600 font-medium">Discover room types</p>
            </button>
          </section>

          {/* Upcoming Reservations */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider">Upcoming Reservations</h2>
              <button onClick={() => navigate('/client/bookings')} className="text-[10px] font-bold text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-widest flex items-center gap-1">
                View All <ChevronRight size={12} />
              </button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-stone-100 py-20 text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-stone-100">
                  <Globe className="w-8 h-8 text-stone-200" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">No Upcoming Stays</h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto mb-6 leading-relaxed">
                  Start exploring Butuan's finest hotels and book your next unforgettable stay.
                </p>
                <button 
                  onClick={() => navigate('/client/search')} 
                  className="h-11 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-xl text-[10px] transition-all active:scale-95 shadow-lg shadow-amber-500/15"
                >
                  Explore Hotels
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 4).map(booking => {
                  const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
                  const checkin = new Date(booking.checkin_date);
                  const checkout = new Date(booking.checkout_date);
                  const nights = Math.max(1, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));

                  return (
                    <div 
                      key={booking.booking_id} 
                      onClick={() => navigate('/client/bookings')}
                      className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-amber-200 transition-all cursor-pointer group hover:shadow-md hover:shadow-amber-500/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors border border-amber-100">
                            <Hotel className="text-amber-600" size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-stone-900 text-sm tracking-tight">{hotel?.name}</h4>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                booking.booking_status === 'confirmed' 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                                  : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                              }`}>
                                {booking.booking_status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-600">
                              <span className="text-[10px] font-medium flex items-center gap-1">
                                <Calendar size={10} />
                                {checkin.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {checkout.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-stone-200">•</span>
                              <span className="text-[10px] font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                              <span className="text-stone-200">•</span>
                              <span className="text-[10px] font-medium text-stone-400">{booking.booking_reference}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="text-stone-200 group-hover:text-amber-500 transition-colors" size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Discover Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-8 text-white relative overflow-hidden group shadow-xl shadow-amber-500/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform backdrop-blur-sm">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Discover Butuan</h3>
              <p className="text-white/60 text-xs font-medium mb-6 leading-relaxed">
                Explore the River City of the South. Rich history, warm hospitality, premium stays.
              </p>
              <button 
                onClick={() => navigate('/client/search')}
                className="w-full h-11 bg-white text-amber-700 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-amber-50 transition-colors"
              >
                Browse Hotels
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-5">Your Journey</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                    <Star size={14} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-stone-500">Lifetime Bookings</span>
                </div>
                <span className="text-sm font-black text-stone-900">{userBookings.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                    <Shield size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-stone-500">Upcoming</span>
                </div>
                <span className="text-sm font-black text-amber-600">{upcomingBookings.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <Clock size={14} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-stone-500">Total Nights</span>
                </div>
                <span className="text-sm font-black text-stone-900">{totalNights}</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-4">Need Help?</h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">Our concierge team is available 24/7 to assist with your reservations.</p>
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors group border border-stone-100 hover:border-amber-200">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors border border-amber-100 group-hover:border-amber-500">
                <Globe size={14} className="text-amber-600 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-700">Contact Support</p>
                <p className="text-[10px] text-stone-600">info@inntera.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
