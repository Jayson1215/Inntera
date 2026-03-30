import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Mail, Phone } from 'lucide-react';
import { staff, hotels } from '../../data/mockData';

export function AdminStaff() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-500 mt-1">View and manage staff members</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => {
                const hotel = hotels.find(h => h.hotel_id === member.hotel_id);
                return (
                  <TableRow key={member.staff_id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">{member.role}</Badge>
                    </TableCell>
                    <TableCell>{hotel?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {member.phone}
                      </div>
                    </TableCell>
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

