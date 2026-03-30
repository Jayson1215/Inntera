import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Search, CheckCircle, LogOut, AlertCircle, Calendar } from 'lucide-react';
import { bookings, Booking, guests, bookingRooms, rooms } from '../../data/mockData';
import { toast } from 'sonner';

export function StaffCheckin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingList, setBookingList] = useState<Booking[]>(bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      
      setBookingList(bookingList.map(b => 
        b.booking_id === selectedBooking.booking_id 
          ? { ...b, booking_status: 'checked-in' as const, notes, modified_at: new Date().toISOString() } 
          : b
      ));
      
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
      
      setBookingList(bookingList.map(b => 
        b.booking_id === bookingId 
          ? { ...b, booking_status: 'checked-out' as const, modified_at: new Date().toISOString() } 
          : b
      ));
      
      toast.success('Guest checked out successfully');
    } catch (err) {
      toast.error('Failed to process check-out');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBookings = bookingList.filter(booking => {
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
        return <Badge className="bg-yellow-100 text-yellow-800">Ready for Check-in</Badge>;
      case 'checked-in':
        return <Badge className="bg-blue-100 text-blue-800">Checked In</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActionButton = (booking: Booking) => {
    if (booking.booking_status === 'confirmed') {
      return (
        <Button 
          onClick={() => handleCheckIn(booking)}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Check In
        </Button>
      );
    } else if (booking.booking_status === 'checked-in') {
      return (
        <Button 
          onClick={() => processCheckOut(booking.booking_id)}
          variant="outline"
          className="border-red-300"
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Check-in / Check-out</h1>
        <p className="text-gray-500 mt-1">Process guest arrivals and departures</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by guest name or booking reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ready for Check-in</p>
                <p className="text-3xl font-bold text-gray-900">{confirmedCheckIns.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-yellow-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Currently Checked In</p>
                <p className="text-3xl font-bold text-gray-900">{checkedInGuests.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-100" />
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
              <Card key={booking.booking_id} className="hover:shadow-md transition-shadow">
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
                        <div className="bg-gray-50 p-2 rounded text-sm italic text-gray-600">
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
              <div className="bg-blue-50 border border-blue-200 rounded p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
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
                  className="bg-green-600 hover:bg-green-700"
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
