import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Eye, Loader2, Search, Calendar, Filter } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Booking, Hotel, Guest } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { bookings, hotels, guests, rooms, isLoading, updateBookingStatus } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
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
    const hotel = hotels.find((h: Hotel) => h.id === b.hotel_id);
    const guestName = `${guest?.first_name || ''} ${guest?.last_name || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || 
      guestName.includes(searchTerm.toLowerCase()) ||
      b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const booking = bookings.find((b: Booking) => b.booking_id === selectedBooking);
  const bookingDetails = booking ? {
    hotel: booking.hotel || hotels.find((h: Hotel) => h.id === booking.hotel_id),
    guest: booking.guest || guests.find((g: Guest) => g.id === booking.guest_id),
    rooms: booking.booking_rooms || [],
    payment: booking.payments && booking.payments.length > 0 ? booking.payments[0] : null
  } : null;

  const handleStatusUpdate = async (bookingId: number, newStatus: Booking['booking_status']) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
          <p className="text-slate-500 mt-1">{bookings.length} total bookings across all properties</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">{bookings.filter(b => b.booking_status === 'confirmed').length} Confirmed</span>
          <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold">{bookings.filter(b => b.booking_status === 'checked-in').length} Checked In</span>
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-bold">{bookings.filter(b => b.booking_status === 'pending').length} Pending</span>
        </div>
      </div>

      {/* Filters */}
      <div className="fade-up flex flex-col md:flex-row gap-3" style={{ animationDelay: '100ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by guest, reference, or hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-out</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking: Booking) => {
                const hotel = hotels.find((h: Hotel) => h.id === booking.hotel_id);
                const guest = guests.find((g: Guest) => g.id === booking.guest_id);
                return (
                  <tr key={booking.booking_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-indigo-600">{booking.booking_reference}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {guest?.first_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-slate-900 font-medium">{guest?.first_name} {guest?.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{hotel?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(booking.checkin_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(booking.checkout_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">₱{Number(booking.total_cost || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking.booking_id)} className="text-slate-500 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="px-6 py-16 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookings found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl !bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl">Booking Details</DialogTitle>
          </DialogHeader>
          {bookingDetails && booking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Reference</p>
                  <p className="font-mono font-bold text-indigo-600">{booking.booking_reference}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(booking.booking_status)}`}>
                    {booking.booking_status}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Hotel</p>
                  <p className="font-semibold text-slate-900">{bookingDetails.hotel?.name}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Guest</p>
                  <p className="font-semibold text-slate-900">{bookingDetails.guest?.first_name} {bookingDetails.guest?.last_name}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Check-in</p>
                  <p className="font-semibold text-slate-900">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Check-out</p>
                  <p className="font-semibold text-slate-900">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-indigo-700">Total Cost</span>
                <span className="text-2xl font-bold text-indigo-700">₱{Number(booking.total_cost || 0).toLocaleString()}</span>
              </div>

              {bookingDetails.rooms.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Rooms</h3>
                  <div className="space-y-2">
                    {bookingDetails.rooms.map((br: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">Room {br.room?.room_number || br.room_id}</p>
                          <p className="text-sm text-slate-500">{br.adults_count} Adults, {br.children_count} Children</p>
                        </div>
                        <p className="font-bold text-slate-900">₱{Number(br.rate || 0).toLocaleString()}/night</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.notes && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-900 mb-1">Notes</h3>
                  <p className="text-sm text-slate-600">{booking.notes}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                {booking.booking_status === 'pending' && (
                  <Button onClick={() => { handleStatusUpdate(booking.booking_id, 'confirmed'); setSelectedBooking(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm</Button>
                )}
                {booking.booking_status === 'confirmed' && (
                  <Button onClick={() => { handleStatusUpdate(booking.booking_id, 'checked-in'); setSelectedBooking(null); }} className="bg-blue-600 hover:bg-blue-700 text-white">Check In</Button>
                )}
                {booking.booking_status !== 'cancelled' && booking.booking_status !== 'checked-out' && (
                  <Button variant="outline" onClick={() => { handleStatusUpdate(booking.booking_id, 'cancelled'); setSelectedBooking(null); }} className="border-red-200 text-red-600 hover:bg-red-50">Cancel</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
