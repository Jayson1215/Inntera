import { Building2, BedDouble, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Hotel, Room, Booking, Guest } from '../../types';

export function AdminDashboard() {
  const { hotels, rooms, bookings, guests, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <p className="mt-6 text-sm font-semibold text-slate-500 tracking-widest uppercase animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const totalHotels = hotels.length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r: Room) => r.status === 'available').length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b: Booking) => 
    b.booking_status === 'confirmed' || b.booking_status === 'checked-in'
  ).length;
  const totalGuests = guests.length;
  const totalRevenue = bookings.reduce((sum: number, b: Booking) => sum + (parseFloat(String(b.total_cost || 0))), 0);
  const occupancyRate = totalRooms > 0 ? Math.round((totalRooms - availableRooms) / totalRooms * 100) : 0;

  const stats = [
    { title: 'Total Hotels', value: totalHotels, icon: Building2, gradient: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50', text: 'text-indigo-700' },
    { title: 'Total Rooms', value: totalRooms, subtitle: `${availableRooms} available`, icon: BedDouble, gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { title: 'Active Bookings', value: activeBookings, subtitle: `${totalBookings} total`, icon: Calendar, gradient: 'from-violet-500 to-violet-700', bg: 'bg-violet-50', text: 'text-violet-700' },
    { title: 'Total Guests', value: totalGuests, icon: Users, gradient: 'from-amber-500 to-amber-700', bg: 'bg-amber-50', text: 'text-amber-700' },
    { title: 'Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: 'from-emerald-500 to-teal-700', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { title: 'Occupancy', value: `${occupancyRate}%`, icon: TrendingUp, gradient: 'from-rose-500 to-rose-700', bg: 'bg-rose-50', text: 'text-rose-700' },
  ];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300';
      case 'checked-in': return 'bg-blue-100 text-blue-700 ring-1 ring-blue-300';
      case 'pending': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300';
      case 'cancelled': return 'bg-red-100 text-red-700 ring-1 ring-red-300';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-300';
    }
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up">
        <h1 className="text-3xl font-bold text-slate-900"> Performance Overview</h1>
        <p className="text-slate-500 mt-1">Real-time metrics across all properties</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="fade-up group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] -mr-8 -mt-8">
                <Icon className="w-full h-full" />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  {stat.subtitle && <p className="text-sm text-slate-500 mt-1">{stat.subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '500ms' }}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Latest Reservations</h2>
            <p className="text-sm text-slate-400">{bookings.length} total bookings</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-slate-500">Live</span>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {recentBookings.map((booking, index) => {
            const hotel = hotels.find((h: Hotel) => h.id === booking.hotel_id);
            const guest = guests.find((g: Guest) => g.id === booking.guest_id);
            return (
              <div
                key={booking.booking_id}
                className="fade-up flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                style={{ animationDelay: `${600 + index * 60}ms` }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {guest?.first_name?.charAt(0) || '?'}{guest?.last_name?.charAt(0) || ''}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{guest?.first_name} {guest?.last_name}</p>
                    <p className="text-sm text-slate-400 truncate">{booking.booking_reference} • {hotel?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Check-in</p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-sm font-bold text-slate-900">₱{Number(booking.total_cost || 0).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(booking.booking_status)}`}>
                    {booking.booking_status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
          {recentBookings.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
