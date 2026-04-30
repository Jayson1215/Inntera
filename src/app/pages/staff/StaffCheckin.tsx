import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Search, CheckCircle, LogOut, Loader2 } from 'lucide-react';
import { Booking, Guest } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'sonner';

export function StaffCheckin() {
  const { bookings, rooms, guests, hotels, isLoading, confirmCheckIn, updateBookingStatus, refreshData } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPaid, setHasPaid] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-stone-900 tracking-widest uppercase animate-pulse">Loading Check-in System...</p>
      </div>
    );
  }

  const handleCheckIn = async (booking: Booking) => {
    setSelectedBooking(booking);
    setNotes(booking.notes || '');
    
    const existingPayment = booking.payments && booking.payments.length > 0 ? booking.payments[0] : null;
    if (existingPayment) {
      setHasPaid(true);
      const method = existingPayment.payment_method.toLowerCase();
      if (method === 'credit_card') setPaymentMethod('Credit Card');
      else if (method === 'debit_card') setPaymentMethod('Debit Card');
      else if (method === 'gcash') setPaymentMethod('GCash');
      else if (method === 'paypal') setPaymentMethod('PayPal');
      else if (method === 'cash') setPaymentMethod('Cash');
      else setPaymentMethod(existingPayment.payment_method);
    } else {
      setHasPaid(false);
      setPaymentMethod('Credit Card');
    }

    if (booking.booking_status === 'confirmed') {
      setIsDialogOpen(true);
    } else {
      await processCheckOut(booking.booking_id);
    }
  };

  const processCheckIn = async () => {
    if (!selectedBooking) return;
    setIsProcessing(true);
    try {
      const paymentData = (hasPaid && balanceDue > 0) ? {
        amount: balanceDue,
        payment_method: paymentMethod === 'Maya' ? 'paymaya' : paymentMethod.toLowerCase().replace(' ', '_'),
      } : null;
      const result = await confirmCheckIn(selectedBooking.booking_id, paymentData, notes);
      if (result.success) {
        toast.success('Guest checked in successfully');
        setIsDialogOpen(false);
        setSelectedBooking(null);
        setNotes('');
        setHasPaid(true);
      } else {
        toast.error(result.error || 'Failed to check in');
      }
    } catch {
      toast.error('Failed to process check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCheckOut = async (bookingId: number) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(bookingId, 'checked-out');
      toast.success('Guest checked out successfully');
    } catch {
      toast.error('Failed to process check-out');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBookings = [...bookings].sort((a,b) => b.booking_id - a.booking_id).filter(booking => {
    const guest = guests.find((g: Guest) => g.id === booking.guest_id);
    const guestName = `${guest?.first_name || ''} ${guest?.last_name || ''}`.toLowerCase();
    const reference = booking.booking_reference.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (guestName.includes(search) || reference.includes(search)) &&
           (booking.booking_status === 'confirmed' || booking.booking_status === 'checked-in');
  });

  const confirmedCheckIns = filteredBookings.filter(b => b.booking_status === 'confirmed');
  const checkedInGuests = filteredBookings.filter(b => b.booking_status === 'checked-in');

  const totalCost = selectedBooking ? Number(selectedBooking.total_cost || 0) : 0;
  const amountPaid = selectedBooking?.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const balanceDue = Math.max(0, totalCost - amountPaid);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      {/* Arrivals & Departures Hero Banner */}
      <div className="bg-gradient-to-br from-orange-950 via-slate-900 to-stone-950 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-orange-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/10 text-orange-400">
                 <LogOut className="w-8 h-8" />
              </div>
              Arrivals & Departures
            </h1>
            <p className="text-orange-50/70 mt-3 text-sm lg:text-base font-medium max-w-lg">
              Process guest transfers, collect balances, and handle room assignments. Ensure a perfectly smooth handover.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end w-full md:w-auto">
             <div className="flex flex-wrap items-center gap-3">
               <span className="px-5 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-orange-100 font-bold text-sm tracking-wide shadow-inner">
                 <span className="text-xl font-black text-white mr-2">{confirmedCheckIns.length}</span> Arriving
               </span>
               <span className="px-5 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-teal-100 font-bold text-sm tracking-wide shadow-inner">
                 <span className="text-xl font-black text-white mr-2">{checkedInGuests.length}</span> In-House
               </span>
             </div>
             
             {/* Search integrated into Hero */}
             <div className="relative w-full md:w-[350px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
               <input type="text" placeholder="Search guests or reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder-white/40 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner" />
             </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-stone-100 px-6 py-16 text-center text-stone-900 shadow-sm">
            {searchTerm ? 'No bookings found matching your search.' : 'No pending check-ins or check-outs.'}
          </div>
        ) : (
          filteredBookings.map((booking: Booking) => {
            const guest = guests.find((g: Guest) => g.id === booking.guest_id);
            const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
            const bookingRoom = booking.booking_rooms?.find((br: any) => br.booking_id === booking.booking_id);
            const room = rooms.find(r => r.room_id === bookingRoom?.room_id);

            return (
              <div key={booking.booking_id} className={`bg-white rounded-[2rem] p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shadow-sm group relative overflow-hidden border-2 ${booking.booking_status === 'confirmed' ? 'border-orange-100 hover:border-orange-200' : 'border-teal-100 hover:border-teal-200'}`}>
                <div className={`absolute top-0 w-full h-1.5 left-0 ${booking.booking_status === 'confirmed' ? 'bg-orange-400' : 'bg-teal-400'}`} />
                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {guest?.first_name?.charAt(0) || '?'}{guest?.last_name?.charAt(0) || ''}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-stone-900">{guest?.first_name} {guest?.last_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {booking.booking_status === 'confirmed' ? 'Ready for Check-in' : 'Checked In'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-900">
                        <span className="font-mono">{booking.booking_reference}</span>
                        <span>{hotel?.name}</span>
                        <span>{new Date(booking.checkin_date).toLocaleDateString()} → {new Date(booking.checkout_date).toLocaleDateString()}</span>
                        {room && <span>Room {room.room_number}</span>}
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-stone-900 mt-1 italic">Notes: {booking.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {booking.booking_status === 'confirmed' ? (
                      <Button onClick={() => handleCheckIn(booking)} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5">
                        <CheckCircle className="w-4 h-4 mr-2" /> Check In
                      </Button>
                    ) : (
                      <Button onClick={() => processCheckOut(booking.booking_id)} disabled={isProcessing} className="bg-slate-700 hover:bg-slate-800 text-white rounded-xl px-5">
                        <LogOut className="w-4 h-4 mr-2" /> Check Out
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Check-in Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[1.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="bg-teal-600 p-6 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10" />
            <DialogTitle className="text-xl font-black tracking-tight relative z-10">Check-in Guest</DialogTitle>
            <DialogDescription className="text-teal-100 font-bold text-xs mt-0.5 relative z-10">
              Review stay details and collect final settlement.
            </DialogDescription>
          </div>

          {selectedBooking && (
            <div className="p-6 space-y-5">
              {/* Guest Profile */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-black text-sm">
                  {guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.first_name?.charAt(0)}
                  {guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.last_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-none">
                    {guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.first_name} {guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.last_name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{selectedBooking.booking_reference}</p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-white border-2 border-slate-100 rounded-xl p-4 space-y-3">
                 <h4 className="text-xs font-black text-slate-900 border-b pb-2">Financial Summary</h4>
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-slate-500">Total Cost</span>
                       <span className="font-black text-slate-900">₱{totalCost.toLocaleString()}</span>
                    </div>
                    {amountPaid > 0 && (
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-600">Advance Deposit</span>
                          <span className="font-black text-emerald-600">-₱{amountPaid.toLocaleString()}</span>
                       </div>
                    )}
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                          {balanceDue === 0 ? 'Status' : 'Balance to Collect'}
                       </p>
                       <p className={`text-xl font-black ${balanceDue === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {balanceDue === 0 ? 'Paid in Full' : `₱${balanceDue.toLocaleString()}`}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Action Controls */}
              {balanceDue > 0 && (
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Payment Method for Balance</label>
                   <select className="w-full h-10 px-3 rounded-lg border-2 border-slate-100 text-sm font-bold bg-slate-50 outline-none focus:border-teal-500 transition-all" value={paymentMethod} onChange={(e) => { setHasPaid(true); setPaymentMethod(e.target.value); }}>
                     <option>Cash</option>
                     <option>Credit Card</option>
                     <option>GCash</option>
                     <option>Maya</option>
                   </select>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Check-in Notes (Optional)</label>
                <textarea 
                   value={notes} 
                   onChange={(e) => setNotes(e.target.value)} 
                   placeholder="e.g., Gave 2 keycards, requested late checkout..."
                   className="w-full h-20 p-3 border-2 border-slate-100 rounded-lg text-xs font-medium text-slate-900 resize-none focus:outline-none focus:border-teal-500 transition-all bg-slate-50" 
                />
              </div>

              {/* Footer Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                   variant="ghost" 
                   onClick={() => setIsDialogOpen(false)} 
                   disabled={isProcessing} 
                   className="flex-1 h-10 rounded-lg font-bold text-slate-600 hover:text-slate-900 transition-all text-xs"
                >
                   Cancel
                </Button>
                <Button 
                   onClick={processCheckIn} 
                   disabled={isProcessing} 
                   className="flex-[2] h-10 rounded-lg font-black bg-teal-600 hover:bg-teal-700 text-white transition-all text-xs shadow-lg shadow-teal-500/20"
                >
                   {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm Check-in'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
