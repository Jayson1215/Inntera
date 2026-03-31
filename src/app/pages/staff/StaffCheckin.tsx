import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Search, CheckCircle, LogOut, AlertCircle, Calendar } from 'lucide-react';
import { Booking, guests, bookingRooms } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'sonner';

export function StaffCheckin() {
  const { bookings, rooms, updateBookingStatus, updateBookingNotes, refreshFromStorage } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Refresh data from storage when component mounts
  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const handleCheckIn = async (booking: Booking) => {
    setSelectedBooking(booking);
    setNotes(booking.notes);
    const action = booking.booking_status === 'confirmed' ? 'checkin' : 'checkout';
    
    if (action === 'checkin') {
      setIsDialogOpen(true);
    } else {
      await processCheckOut(booking.booking_id);
    }
  };

  const processCheckIn = async () => {
    if (!selectedBooking) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateBookingStatus(selectedBooking.booking_id, 'checked-in');
      updateBookingNotes(selectedBooking.booking_id, notes);
      
      toast.success('Guest checked in successfully');
      setIsDialogOpen(false);
      setSelectedBooking(null);
      setNotes('');
    } catch (err) {
      toast.error('Failed to process check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCheckOut = async (bookingId: number) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateBookingStatus(bookingId, 'checked-out');
      toast.success('Guest checked out successfully');
    } catch (err) {
      toast.error('Failed to process check-out');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const guest = guests.find(g => g.guest_id === booking.guest_id);
    const guestName = `${guest?.first_name} ${guest?.last_name}`.toLowerCase();
    const reference = booking.booking_reference.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return (guestName.includes(search) || reference.includes(search)) &&
           (booking.booking_status === 'confirmed' || booking.booking_status === 'checked-in');
  });

  const confirmedCheckIns = filteredBookings.filter(b => b.booking_status === 'confirmed');
  const checkedInGuests = filteredBookings.filter(b => b.booking_status === 'checked-in');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-yellow-200 text-yellow-800 font-semibold">Ready for Check-in</Badge>;
      case 'checked-in':
        return <Badge className="bg-green-200 text-green-800 font-semibold">Checked In</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActionButton = (booking: Booking) => {
    if (booking.booking_status === 'confirmed') {
      return (
        <Button 
          onClick={() => handleCheckIn(booking)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Check In
        </Button>
      );
    } else if (booking.booking_status === 'checked-in') {
      return (
        <Button 
          onClick={() => processCheckOut(booking.booking_id)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={isProcessing}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Check Out
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1e7e5; }
        .stat-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1e7e5; }
        .stat-ready { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #fbbf24; }
        .stat-ready-icon { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; }
        .stat-ready-value { color: #d97706; }
        .stat-checkin { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 2px solid #10b981; }
        .stat-checkin-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
        .stat-checkin-value { color: #047857; }
        .booking-card { background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); border: 1px solid #d1e7e5; }
        .booking-card:hover { box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15); transition: all 0.3s ease; }
        label { color: #111827 !important; }
        .notes-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1e7e5; }
        .search-icon { color: #059669; }
        [role="dialog"] { background-color: #ffffff !important; }
        [role="dialog"] label { color: #111827 !important; }
        [role="dialog"] input { color: #374151 !important; background-color: #ffffff !important; }
        [role="dialog"] textarea { color: #374151 !important; background-color: #ffffff !important; border-color: #d1e7e5 !important; }
        [role="dialog"] h2 { color: #111827 !important; }
        [role="dialog"] p { color: #374151 !important; }
        [role="dialog"] button { color: #ffffff !important; }
        .alert-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1e7e5; }
        .alert-box .icon { color: #059669; }
        .alert-box p { color: #047857; }
        tbody td { color: #374151; }
      `}</style>
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Check-in / Check-out</h1>
        <p className="text-gray-500 mt-1">Process guest arrivals and departures</p>
      </div>

      {/* Search */}
      <Card className="mb-6 table-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 search-icon w-5 h-5" />
            <Input
              placeholder="Search by guest name or booking reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="stat-ready">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Ready for Check-in</p>
                <p className="text-4xl font-bold stat-ready-value">{confirmedCheckIns.length}</p>
                <p className="text-xs text-amber-700 mt-2">Guests pending arrival</p>
              </div>
              <div className="stat-ready-icon w-16 h-16 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-checkin">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-800 mb-1">Currently Checked In</p>
                <p className="text-4xl font-bold stat-checkin-value">{checkedInGuests.length}</p>
                <p className="text-xs text-emerald-700 mt-2">Active guests in hotel</p>
              </div>
              <div className="stat-checkin-icon w-16 h-16 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              {searchTerm ? 'No bookings found matching your search.' : 'No pending check-ins or check-outs.'}
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const guest = guests.find(g => g.guest_id === booking.guest_id);
            const bookingRoom = bookingRooms.find(br => br.booking_id === booking.booking_id);
            const room = rooms.find(r => r.room_id === bookingRoom?.room_id);
            const checkInDate = new Date(booking.checkin_date).toLocaleDateString();
            const checkOutDate = new Date(booking.checkout_date).toLocaleDateString();

            return (
              <Card key={booking.booking_id} className="booking-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guest?.first_name} {guest?.last_name}
                        </h3>
                        {getStatusBadge(booking.booking_status)}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Booking Reference</p>
                          <p className="font-mono font-medium text-gray-900">{booking.booking_reference}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Check-in / Check-out</p>
                          <p>{checkInDate} → {checkOutDate}</p>
                        </div>
                        {room && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Room Assignment</p>
                            <p className="font-medium">Room {room.room_number}</p>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="notes-box p-3 rounded text-sm italic text-emerald-700">
                          Notes: {booking.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {getActionButton(booking)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Check-in Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBooking && `Check In: ${guests.find(g => g.guest_id === selectedBooking.guest_id)?.first_name} ${guests.find(g => g.guest_id === selectedBooking.guest_id)?.last_name}`}
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="alert-box p-3 flex gap-2 rounded">
                <AlertCircle className="icon w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Confirm check-in for booking {selectedBooking.booking_reference}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Add Check-in Notes (Optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Room prepped, keys provided, etc."
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processCheckIn}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
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
