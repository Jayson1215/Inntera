import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { bookings, guests } from '../../data/mockData';

export function StaffBookings() {
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">View all bookings</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const guest = guests.find(g => g.guest_id === booking.guest_id);
                return (
                  <TableRow key={booking.booking_id}>
                    <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                    <TableCell>{guest?.first_name} {guest?.last_name}</TableCell>
                    <TableCell>{new Date(booking.checkin_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.checkout_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{booking.notes || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

