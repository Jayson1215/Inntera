import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, MapPin, Search, Wifi, Clock, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookings, guests, hotels } from '../../data/mockData';

export function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const guest = guests.find(g => g.guest_id === user?.id);
  const userBookings = bookings.filter(b => b.guest_id === user?.id);
  const upcomingBookings = userBookings.filter(b => 
    b.booking_status === 'confirmed' || b.booking_status === 'checked-in'
  );

  const hotelColors = [
    { bg: 'bg-white', border: 'border-2 border-emerald-500', icon: 'text-emerald-600' },
    { bg: 'bg-white', border: 'border-2 border-cyan-500', icon: 'text-cyan-600' },
    { bg: 'bg-white', border: 'border-2 border-purple-500', icon: 'text-purple-600' },
  ];

  return (
    <div>
      <style>{`
        .gradient-welcome {
          background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="mb-8 gradient-welcome rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold">
          Welcome back, {guest?.first_name}!
        </h1>
        <p className="text-emerald-50 mt-2 text-lg">Manage your bookings and explore our collection of premium hotels</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="card-hover border-2 border-emerald-500 hover:border-emerald-600 !bg-white shadow-md">
          <Link to="/client/search">
            <CardContent className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-black">Search Hotels</h3>
                  <p className="text-sm text-gray-800 font-medium">Find your perfect stay</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="card-hover border-2 border-cyan-500 hover:border-cyan-600 !bg-white shadow-md">
          <Link to="/client/bookings">
            <CardContent className="p-6 !bg-white\">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-black">My Bookings</h3>
                  <p className="text-sm text-gray-800 font-medium">{upcomingBookings.length} upcoming stays</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">Upcoming Stays</h2>
          <div className="space-y-4">
            {upcomingBookings.map((booking, idx) => {
              const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
              const colors = ['!bg-white border-l-4 border-emerald-500', '!bg-white border-l-4 border-cyan-500', '!bg-white border-l-4 border-purple-500'];
              return (
                <Card key={booking.booking_id} className={`card-hover ${colors[idx % 3]} bg-white shadow-md border`}>
                  <CardContent className="p-6 !bg-white\">
                    <div className="flex items-start justify-between\">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-black">{hotel?.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-800 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="font-semibold">{hotel?.city}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                            <p className="text-gray-900 text-xs uppercase font-bold">Check-in</p>
                            <p className="font-bold text-black">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                            <p className="text-gray-900 text-xs uppercase font-bold">Check-out</p>
                            <p className="font-bold text-black">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                            <p className="text-gray-900 text-xs uppercase font-bold">Reference</p>
                            <p className="font-bold text-black">{booking.booking_reference}</p>
                          </div>
                        </div>
                      </div>
                      <Link to="/client/bookings">
                        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700">
                          View Details
                        </Button>
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
        <h2 className="text-2xl font-bold mb-6 text-black">Featured Hotels</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => {
            const color = hotelColors[idx % 3];
            return (
              <Card key={hotel.hotel_id} className={`card-hover ${color.bg} ${color.border} !bg-white shadow-md`}>
                <CardContent className="p-6 h-full flex flex-col !bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-black flex-1">{hotel.name}</h3>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Building2 className={`w-5 h-5 ${color.icon}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-900 mb-4 font-semibold">
                    <MapPin className={`w-4 h-4 ${color.icon}`} />
                    {hotel.city}
                  </div>
                  <div className="flex gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1 shadow-sm">
                      <Wifi className={`w-3 h-3 ${color.icon}`} />
                      <span className="text-gray-900 font-medium">WiFi</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1 shadow-sm">
                      <Clock className={`w-3 h-3 ${color.icon}`} />
                      <span className="text-gray-900 font-medium">24/7</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/client/search?city=${encodeURIComponent(hotel.city)}`)}
                    className="w-full mt-auto bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 cursor-pointer"
                  >
                    Explore More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

