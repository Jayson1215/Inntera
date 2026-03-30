import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Mail, Phone } from 'lucide-react';
import { guests, bookings } from '../../data/mockData';

export function AdminGuests() {
  const guestsWithBookings = guests.map(guest => ({
    ...guest,
    bookingCount: bookings.filter(b => b.guest_id === guest.guest_id).length
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Guests Management</h1>
        <p className="text-gray-500 mt-1">View and manage guest information</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Loyalty Member</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestsWithBookings.map((guest) => (
                <TableRow key={guest.guest_id}>
                  <TableCell className="font-medium">
                    {guest.first_name} {guest.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {guest.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {guest.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {guest.loyalty_member_id ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        {guest.loyalty_member_id}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{guest.bookingCount}</TableCell>
                  <TableCell>{new Date(guest.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

