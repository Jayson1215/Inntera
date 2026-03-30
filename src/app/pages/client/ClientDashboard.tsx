import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, MapPin, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookings, guests, hotels } from '../../data/mockData';

export function ClientDashboard() {
  const { user } = useAuth();
  const guest = guests.find(g => g.guest_id === user?.id);
  const userBookings = bookings.filter(b => b.guest_id === user?.id);
  const upcomingBookings = userBookings.filter(b => 
    b.booking_status === 'confirmed' || b.booking_status === 'checked-in'
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {guest?.first_name}!
        </h1>
        <p className="text-gray-500 mt-1">Manage your bookings and explore hotels</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/client/search">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Search Hotels</h3>
                  <p className="text-sm text-gray-600">Find your perfect stay</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/client/bookings">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">My Bookings</h3>
                  <p className="text-sm text-gray-600">{upcomingBookings.length} upcoming</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Stays</h2>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
              return (
                <Card key={booking.booking_id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{hotel?.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {hotel?.city}
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-medium">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Booking Reference</p>
                            <p className="font-medium">{booking.booking_reference}</p>
                          </div>
                        </div>
                      </div>
                      <Link to="/client/bookings">
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Hotels */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Hotels</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.hotel_id} className="hover:shadow-lg transition-shadow">
              <Link to={`/client/hotel/${hotel.hotel_id}`}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    {hotel.city}
                  </div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

