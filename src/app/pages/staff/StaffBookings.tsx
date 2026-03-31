import { useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { bookings as initialBookings, guests } from '../../data/mockData';
import { BookOpen, CheckCircle, LogOut, Calendar } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function StaffBookings() {
  const { bookings, refreshFromStorage } = useBooking();

  // Refresh data from storage when component mounts
  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);
  
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

  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); border: 1px solid #d1d5db; }
        .table-row { transition: all 0.3s ease; border-bottom: 1px solid #e5e7eb !important; }
        .table-row:hover { background-color: #f0fdf4; }
        thead { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-bottom: 2px solid #059669; }
        thead th { font-weight: 700; color: #047857; padding: 14px; }
        tbody td { color: #374151; }
        .stat-total { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #0ea5e9; }
        .stat-total-icon { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; }
        .stat-total-value { color: #0369a1; }
        .stat-confirmed { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 2px solid #10b981; }
        .stat-confirmed-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
        .stat-confirmed-value { color: #047857; }
        .stat-checkin { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #fbbf24; }
        .stat-checkin-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; }
        .stat-checkin-value { color: #d97706; }
        .stat-checkout { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border: 2px solid #d946ef; }
        .stat-checkout-icon { background: linear-gradient(135deg, #d946ef 0%, #c026d3 100%); color: white; }
        .stat-checkout-value { color: #a11bbe; }
      `}</style>
      <div className="flex justify-between items-center mb-8 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">View and manage all guest bookings</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="stat-total">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold stat-total-value">{bookings.length}</p>
              </div>
              <div className="stat-total-icon w-12 h-12 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-confirmed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800 mb-1">Confirmed</p>
                <p className="text-3xl font-bold stat-confirmed-value">{bookings.filter(b => b.booking_status === 'confirmed').length}</p>
              </div>
              <div className="stat-confirmed-icon w-12 h-12 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-checkin">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Checked In</p>
                <p className="text-3xl font-bold stat-checkin-value">{bookings.filter(b => b.booking_status === 'checked-in').length}</p>
              </div>
              <div className="stat-checkin-icon w-12 h-12 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-checkout">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-800 mb-1">Checked Out</p>
                <p className="text-3xl font-bold stat-checkout-value">{bookings.filter(b => b.booking_status === 'checked-out').length}</p>
              </div>
              <div className="stat-checkout-icon w-12 h-12 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="table-card">
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
                  <TableRow key={booking.booking_id} className="table-row">
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

