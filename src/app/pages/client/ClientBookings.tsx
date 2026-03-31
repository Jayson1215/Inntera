import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { MapPin, Calendar, CreditCard, AlertCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookings, hotels, bookingRooms, rooms, payments } from '../../data/mockData';
import { toast } from 'sonner';

export function ClientBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userBookings = bookings.filter(b => b.guest_id === user?.id);
  
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

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

  const handleModifyBooking = (bookingId: number) => {
    setIsModifyDialogOpen(true);
  };

  const handleCancelBooking = (bookingId: number) => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    toast.success('Booking cancelled successfully');
    setIsCancelDialogOpen(false);
  };

  const handleDownloadInvoice = (bookingId: number, bookingRef: string) => {
    // Simple invoice generation - in real app would generate PDF
    const invoiceContent = `Invoice for Booking ${bookingRef}\nDate: ${new Date().toLocaleDateString()}\nBooking ID: ${bookingId}`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent));
    element.setAttribute('download', `Invoice_${bookingRef}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Invoice downloaded successfully');
  };

  const handleSearchHotels = () => {
    navigate('/client/search');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">My Bookings</h1>
        <p className="text-gray-700 mt-1">View and manage your reservations</p>
      </div>

      {userBookings.length === 0 ? (
        <Card className="border-2 border-gray-300 !bg-white shadow-md">
          <CardContent className="p-12 text-center !bg-white">
            <Calendar className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <p className="text-gray-800 mb-4 font-medium">You don't have any bookings yet</p>
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800" onClick={handleSearchHotels}>Search Hotels</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {userBookings.map((booking) => {
            const hotel = hotels.find(h => h.hotel_id === booking.hotel_id);
            const bookingRoom = bookingRooms.find(br => br.booking_id === booking.booking_id);
            const room = rooms.find(r => r.room_id === bookingRoom?.room_id);
            const payment = payments.find(p => p.booking_id === booking.booking_id);

            return (
              <Card key={booking.booking_id} className="border-2 border-cyan-500 !bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 !bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-black">{hotel?.name}</h3>
                        <Badge className={getStatusColor(booking.booking_status)}>
                          {booking.booking_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-800">
                        <MapPin className="w-4 h-4" />
                        {hotel?.address}, {hotel?.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700 font-medium">Booking Reference</p>
                      <p className="text-lg font-bold text-black">{booking.booking_reference}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">Check-in</p>
                        <p className="font-bold text-black">{new Date(booking.checkin_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">After 3:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">Check-out</p>
                        <p className="font-bold text-black">{new Date(booking.checkout_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">Before 11:00 AM</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-700 font-semibold mb-2">Room Details</p>
                      <div className="space-y-1">
                        <p className="font-bold text-black">Room {room?.room_number}</p>
                        <p className="text-sm text-gray-800">
                          {bookingRoom?.adults_count} Adults, {bookingRoom?.children_count} Children
                        </p>
                        <p className="text-sm text-gray-800">
                          ${bookingRoom?.rate} per night
                        </p>
                      </div>
                    </div>

                    {payment && (
                      <div>
                        <p className="text-sm text-gray-700 font-semibold mb-2">Payment</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <p className="text-sm text-gray-800">{payment.payment_method}</p>
                          </div>
                          <p className="text-xl font-bold text-emerald-600">
                            ${payment.amount}
                          </p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-800 font-medium">Notes: {booking.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    {booking.booking_status === 'confirmed' && (
                      <>
                        <Button variant="outline" className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => handleModifyBooking(booking.booking_id)}>Modify Booking</Button>
                        <Button variant="outline" className="border-2 border-red-500 text-red-600 hover:bg-red-50" onClick={() => handleCancelBooking(booking.booking_id)}>
                          Cancel Booking
                        </Button>
                      </>
                    )}
                    <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 flex items-center gap-2" onClick={() => handleDownloadInvoice(booking.booking_id, booking.booking_reference)}>
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modify Booking Dialog */}
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent className="!bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Modify Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-800">Booking modifications are available for confirmed bookings. Please select your new dates:</p>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900">New Check-in Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900">New Check-out Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModifyDialogOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800" onClick={() => {
              toast.success('Booking modified successfully');
              setIsModifyDialogOpen(false);
            }}>Update Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="!bg-white">
          <DialogHeader>
            <DialogTitle className="text-black flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Cancel Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-800">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium">You may be eligible for a refund based on the cancellation policy.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep Booking</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmCancelBooking}>Cancel Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

