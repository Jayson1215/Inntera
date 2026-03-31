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
      case 'confirmed': return 'bg-green-200 text-green-800 font-semibold';
      case 'checked-in': return 'bg-blue-200 text-blue-800 font-semibold';
      case 'checked-out': return 'bg-gray-200 text-gray-800 font-semibold';
      case 'pending': return 'bg-yellow-200 text-yellow-800 font-semibold';
      case 'cancelled': return 'bg-red-200 text-red-800 font-semibold';
      default: return 'bg-gray-200 text-gray-800 font-semibold';
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
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); }
        .table-card-header { background: linear-gradient(135deg, #059669 0%, #047857 100%); box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2); }
        .table-row { transition: all 0.3s ease; border-bottom: 1px solid #000 !important; }
        .table-row:hover { background-color: #f0fdf4; }
        thead { background-color: #f3f4f6; }
        thead th { font-weight: 700; color: #374151; padding: 14px; }
        tbody td { color: #374151; }
        table { table-layout: auto; width: 100%; }
        thead th:nth-child(1) { width: 15%; }
        thead th:nth-child(2) { width: 18%; }
        thead th:nth-child(3) { width: 18%; }
        thead th:nth-child(4) { width: 12%; }
        thead th:nth-child(5) { width: 12%; }
        thead th:nth-child(6) { width: 15%; }
        thead th:nth-child(7) { width: 10%; }
        [role="dialog"] { background-color: #ffffff !important; }
        [role="dialog"] p { color: #374151 !important; }
        [role="dialog"] h2 { color: #111827 !important; }
      `}</style>
      
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-500 mt-1">View and manage all bookings</p>
      </div>

      <Card className="table-card border border-gray-200 animate-fade-in-up rounded-xl overflow-hidden shadow-lg">
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
                        {br.adults_count} Adults, {br.children_count} Children • ₱{br.rate}/night
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
                      <span className="font-medium">₱{bookingDetails.payment.amount}</span>
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

