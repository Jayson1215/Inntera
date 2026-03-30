import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, BedDouble, CheckCircle, Clock } from 'lucide-react';
import { bookings, rooms, guests } from '../../data/mockData';

export function StaffDashboard() {
  const today = new Date().toISOString().split('T')[0];
  
  const todayCheckIns = bookings.filter(b => 
    b.checkin_date.split('T')[0] === today && b.booking_status === 'confirmed'
  ).length;

  const todayCheckOuts = bookings.filter(b => 
    b.checkout_date.split('T')[0] === today && b.booking_status === 'checked-in'
  ).length;

  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;

  const stats = [
    {
      title: 'Today Check-ins',
      value: todayCheckIns,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Today Check-outs',
      value: todayCheckOuts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Available Rooms',
      value: availableRooms,
      icon: BedDouble,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Occupied Rooms',
      value: occupiedRooms,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const upcomingCheckIns = bookings
    .filter(b => b.booking_status === 'confirmed')
    .sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage daily operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Upcoming Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingCheckIns.map((booking) => {
              const guest = guests.find(g => g.guest_id === booking.guest_id);
              return (
                <div key={booking.booking_id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {guest?.first_name} {guest?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{booking.booking_reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="text-sm font-medium">
                      {new Date(booking.checkin_date).toLocaleDateString()}
                    </p>
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

