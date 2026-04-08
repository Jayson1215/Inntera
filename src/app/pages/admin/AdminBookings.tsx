import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Eye, Loader2, Search, Calendar, Filter, CheckCircle2, Clock, XCircle, LogIn, LogOut, ArrowRight, User, Building2, CreditCard, Trash2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Booking, Hotel, Guest } from '../../types';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; ref: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { bookings, hotels, guests, isLoading, updateBookingStatus, deleteBooking } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-black text-slate-400 tracking-widest uppercase animate-pulse">Syncing Reservation Ledger...</p>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'checked-in': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'checked-out': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-3 h-3" />;
      case 'checked-in': return <LogIn className="w-3 h-3" />;
      case 'checked-out': return <LogOut className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return null;
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

  const handleDeleteBooking = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteBooking(deleteTarget.id);
      if (!res.success) {
        console.error('Delete failed:', res.error);
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reservation Ledger</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Monitor and manage global property bookings</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex -space-x-2 mr-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden grayscale">
                   <User className="w-4 h-4 text-slate-400" />
                </div>
              ))}
           </div>
           <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
              {bookings.length} Operations Active
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="fade-up bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4" style={{ animationDelay: '100ms' }}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by reservation ID, guest name, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium h-[42px]">
               <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="All Status" />
               </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Global Status</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="fade-up bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '150ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Reference ID</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Guest Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Property Assignment</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Schedule</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Settlement</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking: Booking) => {
                const hotel = hotels.find((h: Hotel) => h.id === booking.hotel_id);
                const guest = guests.find((g: Guest) => g.id === booking.guest_id);
                return (
                  <tr key={booking.booking_id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <code className="text-[11px] font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100">
                          {booking.booking_reference}
                       </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {guest?.first_name?.charAt(0)}{guest?.last_name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-950 tracking-tight">{guest?.first_name} {guest?.last_name}</span>
                           <span className="text-[10px] font-bold text-slate-400 truncate w-[120px]">{guest?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                       <div className="flex flex-col gap-0.5">
                          <span>{hotel?.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic">{hotel?.city}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500">
                          <span>{new Date(booking.checkin_date).toLocaleDateString()}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                          <span>{new Date(booking.checkout_date).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-sm font-black text-slate-950">₱{Number(booking.total_cost || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-tighter ${getStatusStyles(booking.booking_status)}`}>
                        {getStatusIcon(booking.booking_status)}
                        {booking.booking_status.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedBooking(booking.booking_id)} 
                          className="h-8 w-8 p-0 text-slate-300 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteTarget({ id: booking.booking_id, ref: booking.booking_reference })} 
                          className="h-8 w-8 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-200" />
               </div>
               <h3 className="text-sm font-bold text-slate-900">No matching reservations</h3>
               <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword or status criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
             <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">Reservation Intel</DialogTitle>
                  <p className="text-blue-100 text-[10px] mt-1 font-black uppercase tracking-widest">Enterprise Ledger Summary</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                   <Calendar className="w-6 h-6" />
                </div>
             </div>
          </div>
          {bookingDetails && booking && (
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Reference</p>
                  <p className="font-bold text-blue-600">{booking.booking_reference}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Code</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyles(booking.booking_status)}`}>
                    {booking.booking_status.replace('-', ' ')}
                  </span>
                </div>
                <div className="md:col-span-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Property</p>
                   <p className="text-sm font-bold text-slate-900 line-clamp-1">{bookingDetails.hotel?.name}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Guest Identity</p>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-black">
                        {bookingDetails.guest?.first_name?.charAt(0)}{bookingDetails.guest?.last_name?.charAt(0)}
                     </div>
                     <p className="text-sm font-bold text-slate-900">{bookingDetails.guest?.first_name} {bookingDetails.guest?.last_name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrival Window</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Financial Settlement</h3>
                    <p className="text-3xl font-black text-slate-950 tracking-tight">₱{Number(booking.total_cost || 0).toLocaleString()}</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600">Standard Channel Payment</span>
                 </div>
              </div>

              {bookingDetails.rooms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Allocation</h3>
                  <div className="grid gap-2">
                    {bookingDetails.rooms.map((br: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <Building2 className="w-4 h-4" />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-900">Room {br.room?.room_number || br.room_id}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{br.adults_count} Adults <span className="mx-1">•</span> {br.children_count} Children</p>
                           </div>
                        </div>
                        <p className="text-sm font-black text-slate-950">₱{Number(br.rate || 0).toLocaleString()}/night</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-6 border-t border-slate-100">
                {booking.booking_status === 'pending' && (
                  <Button onClick={() => { handleStatusUpdate(booking.booking_id, 'confirmed'); setSelectedBooking(null); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">Confirm Reservation</Button>
                )}
                {booking.booking_status === 'confirmed' && (
                  <Button onClick={() => { handleStatusUpdate(booking.booking_id, 'checked-in'); setSelectedBooking(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">Process Check-in</Button>
                )}
                {booking.booking_status !== 'cancelled' && booking.booking_status !== 'checked-out' && (
                  <Button variant="ghost" onClick={() => { handleStatusUpdate(booking.booking_id, 'cancelled'); setSelectedBooking(null); }} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold px-6">Void Booking</Button>
                )}
                <Button variant="ghost" onClick={() => setSelectedBooking(null)} className="text-slate-400 font-bold">Dismiss</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Delete Reservation</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              Are you sure you want to permanently delete reservation{' '}
              <code className="text-[11px] font-black bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                {deleteTarget?.ref}
              </code>
              ? This action cannot be undone and all associated data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting...</>
              ) : (
                'Delete Permanently'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
