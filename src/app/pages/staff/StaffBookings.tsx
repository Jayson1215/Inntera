import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { BookOpen, CheckCircle, LogOut, Calendar, Loader2, Search } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Guest, Booking } from '../../types';

export function StaffBookings() {
  const { bookings, guests, hotels, isLoading, refreshFromStorage } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Bookings...</p>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'checked-in': return 'bg-blue-100 text-blue-700';
      case 'checked-out': return 'bg-slate-100 text-slate-600';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredBookings = bookings.filter(b => {
    const guest = guests.find((g: Guest) => g.id === b.guest_id);
    const guestName = `${guest?.first_name || ''} ${guest?.last_name || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || guestName.includes(searchTerm.toLowerCase()) || b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.booking_status === 'confirmed').length,
    checkedIn: bookings.filter(b => b.booking_status === 'checked-in').length,
    checkedOut: bookings.filter(b => b.booking_status === 'checked-out').length,
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 mt-1">View and manage all guest bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationDelay: '80ms' }}>
        {[
          { label: 'Total', value: statusCounts.total, gradient: 'from-blue-500 to-blue-600', icon: BookOpen },
          { label: 'Confirmed', value: statusCounts.confirmed, gradient: 'from-emerald-500 to-emerald-600', icon: Calendar },
          { label: 'Checked In', value: statusCounts.checkedIn, gradient: 'from-amber-500 to-amber-600', icon: CheckCircle },
          { label: 'Checked Out', value: statusCounts.checkedOut, gradient: 'from-violet-500 to-violet-600', icon: LogOut },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-slate-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="fade-up flex flex-col md:flex-row gap-3" style={{ animationDelay: '160ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by guest or reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '240ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-out</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking: Booking) => {
                const guest = guests.find((g: Guest) => g.id === booking.guest_id);
                const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
                return (
                  <tr key={booking.booking_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-mono font-semibold text-teal-600">{booking.booking_reference}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                          {guest?.first_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{guest?.first_name} {guest?.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{hotel?.name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{new Date(booking.checkin_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{new Date(booking.checkout_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-400 max-w-[150px] truncate">{booking.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="px-6 py-16 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
