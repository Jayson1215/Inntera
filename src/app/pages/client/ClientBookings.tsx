import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MapPin, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookings, hotels, bookingRooms, rooms, payments } from '../../data/mockData';

export function ClientBookings() {
  const { user } = useAuth();
  const userBookings = bookings.filter(b => b.guest_id === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'checked-in': return 'bg-blue-100 text-blue-700';
      case 'checked-out': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage your reservations</p>
      </div>

      {userBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You don't have any bookings yet</p>
            <Button>Search Hotels</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {userBookings.map((booking) => {
            const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
            const bookingRoom = bookingRooms.find(br => br.booking_id === booking.booking_id);
            const room = rooms.find(r => r.room_id === bookingRoom?.room_id);
            const payment = payments.find(p => p.booking_id === booking.booking_id);

            return (
              <Card key={booking.booking_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{hotel?.name}</h3>
                        <Badge className={getStatusColor(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {hotel?.address}, {hotel?.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Booking Reference</p>
                      <p className="text-lg font-semibold">{booking.booking_reference}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">After 3:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Before 11:00 AM</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Room Details</p>
                      <div className="space-y-1">
                        <p className="font-medium">Room {room?.room_number}</p>
                        <p className="text-sm text-gray-600">
                          {bookingRoom?.adults_count} Adults, {bookingRoom?.children_count} Children
                        </p>
                        <p className="text-sm text-gray-600">
                          ${bookingRoom?.rate} per night
                        </p>
                      </div>
                    </div>

                    {payment && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Payment</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <p className="text-sm">{payment.payment_method}</p>
                          </div>
                          <p className="text-xl font-semibold text-blue-600">
                            ${payment.amount}
                          </p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    {booking.booking_status === 'confirmed' && (
                      <>
                        <Button variant="outline">Modify Booking</Button>
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          Cancel Booking
                        </Button>
                      </>
                    )}
                    <Button variant="outline">Download Invoice</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

