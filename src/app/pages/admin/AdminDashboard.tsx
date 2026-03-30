import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Building2, 
  BedDouble, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
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
      value: `$${totalRevenue.toLocaleString()}`,
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your hotel management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
              const guest = guests.find(g => g.guest_id === booking.guest_id);
              return (
                <div key={booking.booking_id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.booking_reference}</p>
                    <p className="text-sm text-gray-500">
                      {guest?.first_name} {guest?.last_name} • {hotel?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="text-sm font-medium">
                        {new Date(booking.checkin_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.booking_status === 'checked-in' ? 'bg-blue-100 text-blue-700' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.booking_status}
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

