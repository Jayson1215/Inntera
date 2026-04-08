import { Building2, BedDouble, Calendar, Users, DollarSign, TrendingUp, ArrowRight, ArrowUpRight, Activity } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Hotel, Room, Booking, Guest } from '../../types';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { hotels, rooms, bookings, guests, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-sm font-black text-slate-400 tracking-widest uppercase animate-pulse">Initializing Data...</p>
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
    { title: 'Properties', value: totalHotels, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Inventory', value: totalRooms, subtitle: `${availableRooms} Available`, icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Stays', value: activeBookings, subtitle: `${totalBookings} Total`, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Registered Guests', value: totalGuests, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Gross Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Occupancy Rate', value: `${occupancyRate}%`, icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'checked-in': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Hub Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Real-time property performance and metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
           <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live Sync Actionable</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="fade-up group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-[11px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                       <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                       {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shadow-sm border border-black/5`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="fade-up bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '400ms' }}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Calendar className="w-4 h-4 text-blue-600" />
             </div>
             <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Reservations</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{bookings.length} system bookings</p>
             </div>
          </div>
          <Link to="/admin/bookings">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-[11px] uppercase tracking-widest">
              View All <ArrowRight className="w-3 h-3 ml-1.5" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentBookings.map((booking, index) => {
            const hotel = hotels.find((h: Hotel) => h.id === booking.hotel_id);
            const guest = guests.find((g: Guest) => g.id === booking.guest_id);
            return (
              <div
                key={booking.booking_id}
                className="fade-up flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors group"
                style={{ animationDelay: `${500 + index * 50}ms` }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {guest?.first_name?.charAt(0)}{guest?.last_name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{guest?.first_name} {guest?.last_name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                       {booking.booking_reference} <span className="mx-1.5 text-slate-200">|</span> <span className="text-blue-600">{hotel?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 flex-shrink-0 ml-4">
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Check-in</p>
                    <p className="text-xs font-bold text-slate-700">
                      {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Settlement</p>
                    <p className="text-xs font-black text-slate-950">₱{Number(booking.total_cost || 0).toLocaleString()}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-tighter ${getStatusStyles(booking.booking_status)}`}>
                    {booking.booking_status.replace('-', ' ')}
                  </div>
                </div>
              </div>
            );
          })}
          {recentBookings.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Calendar className="w-12 h-12 text-slate-100 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-slate-900">No recent activity</h3>
              <p className="text-xs text-slate-500 mt-1">Activity logs will appear here once bookings are created.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
