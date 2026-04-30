import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Loader2, Search, Plus, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Guest, Booking } from '../../types';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from 'sonner';

export function StaffBookings() {
  const { bookings, guests, hotels, rooms, isLoading, refreshData, updateBookingStatus, createWalkInBooking, verifyPayment } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [walkInForm, setWalkInForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hotel_id: '',
    room_id: '',
    checkin_date: new Date().toISOString().split('T')[0],
    checkout_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults_count: 1,
    children_count: 0,
    total_cost: 0,
    payment_received: 0,
    payment_method: 'Cash',
  });

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.first_name) { toast.error('First Name is required'); return; }
    if (!walkInForm.last_name) { toast.error('Last Name is required'); return; }
    if (!walkInForm.email) { toast.error('Email is required'); return; }
    if (!walkInForm.checkin_date || !walkInForm.checkout_date) { toast.error('Dates are required'); return; }

    setIsSubmitting(true);
    try {
      const res = await createWalkInBooking({
        guest_details: {
          first_name: walkInForm.first_name,
          last_name: walkInForm.last_name,
          email: walkInForm.email || undefined,
          phone: walkInForm.phone || undefined,
        },
        hotel_id: parseInt(walkInForm.hotel_id),
        room_id: parseInt(walkInForm.room_id),
        checkin_date: walkInForm.checkin_date,
        checkout_date: walkInForm.checkout_date,
        adults_count: walkInForm.adults_count,
        children_count: walkInForm.children_count,
        total_cost: walkInForm.total_cost,
        payment_received: walkInForm.payment_received,
        payment_method: walkInForm.payment_method,
      });

      if (res.success) {
        setIsWalkInOpen(false);
        setWalkInForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          hotel_id: '',
          room_id: '',
          checkin_date: new Date().toISOString().split('T')[0],
          checkout_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          adults_count: 1,
          children_count: 0,
          total_cost: 0,
          payment_received: 0,
          payment_method: 'Cash',
        });
      } else {
        toast.error(res.error || 'Failed to create walk-in booking');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
             <Dialog open={isWalkInOpen} onOpenChange={setIsWalkInOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-teal-500/20 flex gap-2">
                    <Plus className="w-4 h-4" /> Rapid Walk-in
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                  <form onSubmit={handleWalkInSubmit}>
                    <div className="bg-teal-600 p-8 text-white relative">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                      <DialogTitle className="text-3xl font-black tracking-tight relative z-10">Walk-in Check-in</DialogTitle>
                      <DialogDescription className="text-teal-100 font-bold text-sm mt-1 relative z-10">
                        Register and check-in a new walk-in guest instantly.
                      </DialogDescription>
                    </div>
                    
                    <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                      {/* Guest Details */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4 border-b pb-2">1. Guest Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">First Name</Label>
                            <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" placeholder="First Name" value={walkInForm.first_name} onChange={e => setWalkInForm({...walkInForm, first_name: e.target.value})} required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Last Name</Label>
                            <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" placeholder="Last Name" value={walkInForm.last_name} onChange={e => setWalkInForm({...walkInForm, last_name: e.target.value})} required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Email Address (Optional)</Label>
                            <Input type="email" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" placeholder="Email" value={walkInForm.email} onChange={e => setWalkInForm({...walkInForm, email: e.target.value})} />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Phone Number (Optional)</Label>
                            <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" placeholder="Phone" value={walkInForm.phone} onChange={e => setWalkInForm({...walkInForm, phone: e.target.value})} />
                          </div>
                        </div>
                      </div>

                      {/* Stay Details */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4 border-b pb-2">2. Stay Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Select Hotel</Label>
                             <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500/20" value={walkInForm.hotel_id} onChange={e => setWalkInForm({...walkInForm, hotel_id: e.target.value})} required>
                               <option value="">Select Hotel</option>
                               {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                             </select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Assign Room</Label>
                             <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500/20" value={walkInForm.room_id} onChange={e => setWalkInForm({...walkInForm, room_id: e.target.value})} required>
                               <option value="">Select Room</option>
                               {rooms.filter(r => r.status === 'available' && (walkInForm.hotel_id ? r.hotel_id === parseInt(walkInForm.hotel_id) : true)).map(r => (
                                 <option key={r.room_id} value={r.room_id}>Room {r.room_number} ({r.room_type?.name})</option>
                               ))}
                             </select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Check-in Date</Label>
                            <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" value={walkInForm.checkin_date} onChange={e => setWalkInForm({...walkInForm, checkin_date: e.target.value})} required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Check-out Date</Label>
                            <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" value={walkInForm.checkout_date} onChange={e => setWalkInForm({...walkInForm, checkout_date: e.target.value})} required />
                          </div>
                        </div>
                      </div>

                      {/* Payment */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4 border-b pb-2">3. Payment</h3>
                        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Total Amount</Label>
                            <Input type="number" className="h-12 rounded-xl border-slate-200 font-black text-slate-900 text-lg bg-white" value={walkInForm.total_cost} onChange={e => setWalkInForm({...walkInForm, total_cost: parseFloat(e.target.value)})} required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Amount Paid</Label>
                            <Input type="number" className="h-12 rounded-xl border-slate-200 font-black text-emerald-600 text-lg bg-white" value={walkInForm.payment_received} onChange={e => setWalkInForm({...walkInForm, payment_received: parseFloat(e.target.value)})} />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">Method</Label>
                            <select className="w-full h-12 px-4 rounded-xl border border-slate-200 font-bold bg-white outline-none" value={walkInForm.payment_method} onChange={e => setWalkInForm({...walkInForm, payment_method: e.target.value})}>
                              <option>Cash</option>
                              <option>Credit Card</option>
                              <option>GCash</option>
                              <option>Maya</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
                      <Button type="button" variant="ghost" className="rounded-xl font-bold text-slate-600" onClick={() => setIsWalkInOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black px-10 h-12 shadow-lg shadow-teal-500/20" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Complete Check-in'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
             </Dialog>

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
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Lifecycle</th>
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
