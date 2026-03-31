import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Building2, BedDouble, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { hotels, rooms, bookings, guests, payments } from '../../data/mockData';

export function AdminDashboard() {
  // Calculate stats
  const totalHotels = hotels.length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => 
    b.booking_status === 'confirmed' || b.booking_status === 'checked-in'
  ).length;
  const totalGuests = guests.length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      title: 'Total Hotels',
      value: totalHotels,
      icon: Building2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Rooms',
      value: totalRooms,
      subtitle: `${availableRooms} available`,
      icon: BedDouble,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      subtitle: `${totalBookings} total`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Guests',
      value: totalGuests,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: `₱${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Occupancy Rate',
      value: `${Math.round((totalRooms - availableRooms) / totalRooms * 100)}%`,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  // Recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .stat-card {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        .reservation-row {
          animation: slideInLeft 0.4s ease-out forwards;
        }

        .stat-card {
          border-top: 4px solid;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        }

        .stat-card:nth-child(1) {
          border-top-color: #059669;
        }

        .stat-card:nth-child(2) {
          border-top-color: #16a34a;
        }

        .stat-card:nth-child(3) {
          border-top-color: #a855f7;
        }

        .stat-card:nth-child(4) {
          border-top-color: #ea580c;
        }

        .stat-card:nth-child(5) {
          border-top-color: #059669;
        }

        .stat-card:nth-child(6) {
          border-top-color: #ec4899;
        }

        .stat-card:hover {
          box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.15), 0 10px 10px -5px rgba(5, 150, 105, 0.04) !important;
        }

        .stat-icon-box {
          position: relative;
          overflow: hidden;
        }

        .stat-icon-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255, 0.4), transparent);
          pointer-events: none;
        }

        .reservation-card-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
        }
      `}</style>

      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Performance Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your hotels and bookings in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="stat-card border-gray-200 hover:shadow-2xl transition-all bg-white rounded-xl overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-emerald-600 font-medium">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`stat-icon-box w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card className="border border-gray-200 bg-white animate-fade-in-up rounded-xl overflow-hidden shadow-lg">
        <CardHeader className="reservation-card-header border-b-0 py-6">
          <CardTitle className="text-white text-2xl">Latest Reservations</CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div>
            {recentBookings.map((booking, index) => {
              const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
              const guest = guests.find(g => g.guest_id === booking.guest_id);
              return (
                <div 
                  key={booking.booking_id} 
                  className="flex items-center justify-between p-5 hover:bg-emerald-50/50 transition-all bg-white border-b border-gray-100 reservation-row group"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{booking.booking_reference}</p>
                    <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      {guest?.first_name} {guest?.last_name} • {hotel?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Check-In</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800 ring-1 ring-green-300' :
                      booking.booking_status === 'checked-in' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300' :
                      'bg-gray-100 text-gray-800 ring-1 ring-gray-300'
                    }`}>
                      {booking.booking_status.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

