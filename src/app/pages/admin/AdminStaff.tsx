import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Mail, Phone } from 'lucide-react';
import { staff, hotels } from '../../data/mockData';

export function AdminStaff() {
  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); }
        .table-row { transition: all 0.3s ease; border-bottom: 1px solid #000 !important; }
        .table-row:hover { background-color: #f0fdf4; }
        thead { background-color: #f3f4f6; }
        thead th { font-weight: 700; color: #374151; padding: 14px; }
        tbody td { color: #374151; }
      `}</style>
      
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-500 mt-1">View and manage staff members</p>
      </div>

      <Card className="table-card border border-gray-200 animate-fade-in-up rounded-xl overflow-hidden shadow-lg">
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
                      <Badge className="bg-green-200 text-green-800 font-semibold">{member.role}</Badge>
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

