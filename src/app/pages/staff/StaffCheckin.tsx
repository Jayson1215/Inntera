import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Search, CheckCircle, LogOut, AlertCircle, Calendar, Loader2 } from 'lucide-react';
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
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Check-in System...</p>
      </div>
    );
  }

  const handleCheckIn = async (booking: Booking) => {
    setSelectedBooking(booking);
    setNotes(booking.notes || '');
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
      const paymentData = hasPaid ? {
        amount: selectedBooking.total_cost,
        payment_method: paymentMethod.toLowerCase().replace(' ', '_'),
      } : null;
      const result = await confirmCheckIn(selectedBooking.booking_id, paymentData, notes);
      if (result.success) {
        toast.success('Guest checked in successfully');
        setIsDialogOpen(false);
        setSelectedBooking(null);
        setNotes('');
        setHasPaid(false);
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

  const filteredBookings = bookings.filter(booking => {
    const guest = guests.find((g: Guest) => g.id === booking.guest_id);
    const guestName = `${guest?.first_name || ''} ${guest?.last_name || ''}`.toLowerCase();
    const reference = booking.booking_reference.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (guestName.includes(search) || reference.includes(search)) &&
           (booking.booking_status === 'confirmed' || booking.booking_status === 'checked-in');
  });

  const confirmedCheckIns = filteredBookings.filter(b => b.booking_status === 'confirmed');
  const checkedInGuests = filteredBookings.filter(b => b.booking_status === 'checked-in');

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up">
        <h1 className="text-3xl font-bold text-slate-900">Check-in / Check-out</h1>
        <p className="text-slate-500 mt-1">Process guest arrivals and departures</p>
      </div>

      {/* Search */}
      <div className="fade-up relative" style={{ animationDelay: '80ms' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by guest name or booking reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      {/* Stats */}
      <div className="fade-up grid md:grid-cols-2 gap-4" style={{ animationDelay: '160ms' }}>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-700">Ready for Check-in</p>
              <p className="text-4xl font-bold text-amber-600 mt-1">{confirmedCheckIns.length}</p>
              <p className="text-xs text-amber-500 mt-1">Guests pending arrival</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-700">Currently Checked In</p>
              <p className="text-4xl font-bold text-emerald-600 mt-1">{checkedInGuests.length}</p>
              <p className="text-xs text-emerald-500 mt-1">Active guests in hotel</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="fade-up space-y-3" style={{ animationDelay: '240ms' }}>
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center text-slate-400">
            {searchTerm ? 'No bookings found matching your search.' : 'No pending check-ins or check-outs.'}
          </div>
        ) : (
          filteredBookings.map((booking: Booking) => {
            const guest = guests.find((g: Guest) => g.id === booking.guest_id);
            const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
            const bookingRoom = booking.booking_rooms?.find((br: any) => br.booking_id === booking.booking_id);
            const room = rooms.find(r => r.room_id === bookingRoom?.room_id);

            return (
              <div key={booking.booking_id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {guest?.first_name?.charAt(0) || '?'}{guest?.last_name?.charAt(0) || ''}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900">{guest?.first_name} {guest?.last_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${booking.booking_status === 'confirmed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {booking.booking_status === 'confirmed' ? 'Ready for Check-in' : 'Checked In'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="font-mono">{booking.booking_reference}</span>
                        <span>{hotel?.name}</span>
                        <span>{new Date(booking.checkin_date).toLocaleDateString()} → {new Date(booking.checkout_date).toLocaleDateString()}</span>
                        {room && <span>Room {room.room_number}</span>}
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">Notes: {booking.notes}</p>
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
        <DialogContent className="!bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-xl">
              {selectedBooking && `Check In: ${guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.first_name} ${guests.find((g: Guest) => g.id === selectedBooking.guest_id)?.last_name}`}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-5">
              <div className="bg-teal-50 rounded-xl p-4 flex items-start gap-3 border border-teal-200">
                <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-teal-800">Confirm check-in for booking {selectedBooking.booking_reference}</p>
                  <p className="text-xs text-teal-600 mt-1">Total: ₱{Number(selectedBooking.total_cost || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-slate-900">Payment Received?</label>
                    <p className="text-xs text-slate-400">Has the guest paid?</p>
                  </div>
                  <input type="checkbox" checked={hasPaid} onChange={(e) => setHasPaid(e.target.checked)} className="w-5 h-5 accent-teal-600 rounded" />
                </div>

                {hasPaid && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">Payment Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>Cash</option>
                      <option>GCash</option>
                      <option>PayPal</option>
                      <option>PayMaya</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Check-in Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Room prepped, keys provided..."
                  className="w-full h-20 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing} className="rounded-xl !text-slate-700">Cancel</Button>
                <Button onClick={processCheckIn} disabled={isProcessing} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                  {isProcessing ? 'Processing...' : 'Confirm Check-in'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
