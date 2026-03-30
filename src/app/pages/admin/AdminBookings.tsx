import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Eye } from 'lucide-react';
import { bookings, hotels, guests, bookingRooms, rooms, payments } from '../../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);

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

  const booking = bookings.find(b => b.booking_id === selectedBooking);
  const bookingDetails = booking ? {
    hotel: hotels.find(h => h.hotel_id === booking.hotel_id),
    guest: guests.find(g => g.guest_id === booking.guest_id),
    rooms: bookingRooms.filter(br => br.booking_id === booking.booking_id).map(br => ({
      ...br,
      room: rooms.find(r => r.room_id === br.room_id)
    })),
    payment: payments.find(p => p.booking_id === booking.booking_id)
  } : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-500 mt-1">View and manage all bookings</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
                const guest = guests.find(g => g.guest_id === booking.guest_id);
                return (
                  <TableRow key={booking.booking_id}>
                    <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                    <TableCell>{guest?.first_name} {guest?.last_name}</TableCell>
                    <TableCell>{hotel?.name}</TableCell>
                    <TableCell>{new Date(booking.checkin_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.checkout_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(booking.booking_id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {bookingDetails && booking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-medium">{booking.booking_reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(booking.booking_status)}>
                    {booking.booking_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hotel</p>
                  <p className="font-medium">{bookingDetails.hotel?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guest</p>
                  <p className="font-medium">
                    {bookingDetails.guest?.first_name} {bookingDetails.guest?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rooms</h3>
                <div className="space-y-2">
                  {bookingDetails.rooms.map((br) => (
                    <div key={br.booking_room_id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">Room {br.room?.room_number}</p>
                      <p className="text-sm text-gray-600">
                        {br.adults_count} Adults, {br.children_count} Children • ${br.rate}/night
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {bookingDetails.payment && (
                <div>
                  <h3 className="font-semibold mb-2">Payment</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${bookingDetails.payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span>{bookingDetails.payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(bookingDetails.payment.status)}>
                        {bookingDetails.payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {booking.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

