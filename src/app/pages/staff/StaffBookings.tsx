import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Loader2, Search, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Guest, Booking } from '../../types';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function StaffBookings() {
  const { bookings, guests, hotels, rooms, isLoading, refreshData, updateBookingStatus, verifyPayment } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
      case 'pending': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-400 animate-pulse';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredBookings = [...bookings].sort((a, b) => b.booking_id - a.booking_id).filter(b => {
    const guest = guests.find((g: Guest) => g.id === b.guest_id);
    const guestName = `${guest?.first_name || ''} ${guest?.last_name || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || guestName.includes(searchTerm.toLowerCase()) || b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: bookings.length,
    pending: bookings.filter(b => b.booking_status === 'pending').length,
    confirmed: bookings.filter(b => b.booking_status === 'confirmed').length,
    checkedIn: bookings.filter(b => b.booking_status === 'checked-in').length,
    checkedOut: bookings.filter(b => b.booking_status === 'checked-out').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      {/* Reservations Desk Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-stone-950 p-8 shadow-2xl border border-stone-800 shrink-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Active Operations Ledger</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">Reservations Desk</h1>
            <p className="text-sm font-medium text-stone-200 max-w-xl leading-relaxed">
              Handle global reservations, verify guest credentials, and authorize check-ins.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-xl">
               <div className="px-4 py-2 rounded-xl bg-stone-950 flex flex-col items-center justify-center border border-white/5">
                 <span className="text-lg font-black text-amber-400 leading-none">{statusCounts.pending}</span>
                 <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black mt-1">Pending</span>
               </div>
               <div className="px-4 py-2 rounded-xl bg-stone-950 flex flex-col items-center justify-center border border-white/5">
                 <span className="text-lg font-black text-emerald-400 leading-none">{statusCounts.confirmed}</span>
                 <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-black mt-1">Confirmed</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-900" />
            <input type="text" placeholder="Search by guest, reference, or asset..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 shadow-inner text-stone-900 text-sm font-bold placeholder-stone-500 outline-none focus:ring-2 focus:ring-teal-500/20" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3.5 rounded-xl border border-stone-200 bg-stone-50 shadow-inner text-stone-900 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer">
            <option value="all">Global Ledger</option>
            <option value="pending">Pending Auth</option>
            <option value="confirmed">Authorized</option>
            <option value="checked-in">Occupying</option>
            <option value="checked-out">Archive</option>
            <option value="cancelled">Void</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-xl shadow-stone-200/40 min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50 text-stone-900">
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest">Reference ID</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest">Guest Identity</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest">Assigned Property</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Schedule</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredBookings.map((booking: Booking) => {
                const guest = guests.find((g: Guest) => g.id === booking.guest_id);
                const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
                return (
                  <tr key={booking.booking_id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <code className="text-[11px] font-black bg-stone-100 text-stone-900 px-3 py-1.5 rounded-md border border-stone-200 shadow-sm">
                          {booking.booking_reference}
                       </code>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 text-[10px] font-black border border-stone-200 group-hover:bg-teal-600 group-hover:text-white transition-all">
                          {guest?.first_name?.charAt(0)}{guest?.last_name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-stone-900 tracking-tight">{guest?.first_name} {guest?.last_name}</span>
                           <span className="text-[10px] font-bold text-stone-900 truncate max-w-[150px]">{guest?.email}</span>
                           {booking.notes?.includes('Ref:') && (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-100 flex items-center gap-1 w-fit">
                                 <ShieldCheck size={10} />
                                 {booking.notes?.match(/(GCash|Maya) Ref: (.*?),/)?.[0]?.replace(',', '') || booking.notes?.match(/(GCash|Maya) Ref: (.*)/)?.[0]}
                              </span>
                           )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-stone-900">{hotel?.name}</span>
                          <span className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em]">{hotel?.city}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="inline-flex items-center gap-2 bg-white border border-stone-100 px-3 py-1.5 rounded-lg shadow-sm text-[10px] font-black text-stone-900">
                          <span>{new Date(booking.checkin_date).toLocaleDateString()}</span>
                          <span className="text-teal-500 opacity-50">•</span>
                          <span>{new Date(booking.checkout_date).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(booking.booking_status)}`}>
                         {booking.booking_status.replace('-', ' ')}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {booking.booking_status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                             <Button 
                                size="sm" 
                                onClick={async () => {
                                  if (booking.notes?.includes('Ref:')) {
                                    const res = await verifyPayment(booking.booking_id);
                                    if (res.success) {
                                      toast.success('Payment Verified', {
                                        description: `Booking ${booking.booking_reference} has been verified and confirmed.`
                                      });
                                    } else {
                                      toast.error('Verification failed: ' + res.error);
                                    }
                                  } else {
                                    await updateBookingStatus(booking.booking_id, 'confirmed');
                                    toast.success('Booking Authorized', {
                                      description: `Booking ${booking.booking_reference} has been authorized.`
                                    });
                                  }
                                }} 
                                className={`${booking.notes?.includes('Ref:') ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-black text-[9px] uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg transition-all`}
                             >
                                {booking.notes?.includes('Ref:') ? 'Verify Payment' : 'Authorize'}
                             </Button>
                             <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(booking.booking_id, 'cancelled')} className="text-stone-900 hover:text-red-600 hover:bg-red-50 font-black text-[9px] uppercase tracking-widest h-9 px-4 rounded-xl">Void</Button>
                          </div>
                       ) : booking.booking_status === 'confirmed' ? (
                          <Link to="/staff/checkin">
                             <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-black text-[9px] uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg shadow-teal-500/10">Proceed to Check-in</Button>
                          </Link>
                       ) : (
                          <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest opacity-30">Processed</span>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-stone-900" />
               </div>
               <h3 className="text-lg font-black text-stone-900">No matching reservations</h3>
               <p className="text-sm font-medium text-stone-900 mt-2">No active records found in this operational segment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
;
}
