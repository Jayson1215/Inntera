import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, Search, BedDouble, ChevronRight, X, Receipt, Info, ShieldCheck, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { toast } from 'sonner';

export function ClientBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings: contextBookings, hotels, deleteBooking, rooms: allRooms, guests, roomTypes } = useBooking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const highlightedId = location.state?.highlightedBookingId;
  const bookingRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pdfRef = useRef<HTMLDivElement>(null);

  // Match bookings by guest_id (if they are a registered guest) OR by user email (fallback)
  const userBookings = contextBookings.filter(b => {
    // Exact match if user.id matches guest_id
    if (user?.id && b.guest_id === user.id) return true;
    
    // Fallback: Check if the guest associated with this booking has the same email as the logged-in user
    const bookingGuest = b.guest || guests.find(g => g.id === b.guest_id);
    if (bookingGuest && user?.email && bookingGuest.email === user.email) return true;

    return false;
  });

  useEffect(() => {
    if (highlightedId && bookingRefs.current[highlightedId]) {
      bookingRefs.current[highlightedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId, userBookings]);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'checked-in', 'reviewed', 'reserved'].includes(b.booking_status);
    if (activeTab === 'past') return ['checked-out', 'cancelled'].includes(b.booking_status);
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/50', label: 'Confirmed' };
      case 'checked-in': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/50', label: 'In Residence' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/50', label: 'Waiting Approval' };
      case 'reserved': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/50', label: 'Reserved' };
      case 'checked-out': return { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200/50', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200/50', label: 'Cancelled' };
      default: return { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200/50', label: status };
    }
  };

  const getNights = (checkin: string, checkout: string) => {
    const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? If cancelled before the check-in date, your downpayment will be refunded according to our policy.')) return;
    
    setIsCancelling(true);
    const result = await deleteBooking(id);
    setIsCancelling(false);
    
    if (result.success) {
      toast.success('Reservation cancelled successfully.');
      setIsDetailsOpen(false);
    } else {
      toast.error(result.error || 'Failed to cancel reservation');
    }
  };

  const canCancel = (checkin: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(checkin) > today;
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !selectedBooking) return;
    
    try {
      setIsGeneratingPDF(true);
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Inntera_Receipt_REF_${selectedBooking.booking_reference}.pdf`);
      toast.success('PDF Receipt downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-[#FAFAF9] min-h-screen font-sans -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={12} />
              Verified Guest
            </div>
            <h1 className="text-5xl font-black text-stone-900 tracking-tight leading-none">
              Your <span className="text-amber-600">Journeys.</span>
            </h1>
            <p className="text-stone-500 font-medium max-w-md">
              Manage your upcoming stays and relive your past experiences at our world-class destinations.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="bg-white p-1.5 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/60 flex items-center backdrop-blur-sm">
              {(['all', 'upcoming', 'past'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === tab 
                      ? "bg-stone-900 text-white shadow-lg" 
                      : "text-stone-400 hover:text-stone-900 hover:bg-stone-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-stone-100 py-32 text-center shadow-xl shadow-stone-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-amber-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-stone-50 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-stone-100 group-hover:scale-110 transition-transform duration-500">
                <Search className="w-10 h-10 text-stone-200" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">No Stays Found</h3>
              <p className="text-stone-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                Your next extraordinary adventure hasn't been written yet. Where would you like to go next?
              </p>
              <Button 
                onClick={() => navigate('/client/search')}
                className="h-14 px-12 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-amber-600/20 active:scale-95 transition-all"
              >
                Find Your Haven
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredBookings.map(booking => {
              const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
              const statusStyle = getStatusStyles(booking.booking_status);
              const nights = getNights(booking.checkin_date, booking.checkout_date);

              return (
                <div 
                  key={booking.booking_id}
                  ref={el => bookingRefs.current[booking.booking_id] = el}
                  onClick={() => { setSelectedBooking(booking); setIsDetailsOpen(true); }}
                  className={cn(
                    "bg-white rounded-[2rem] border-2 border-transparent p-4 md:p-6 cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/60 overflow-hidden relative",
                    highlightedId === booking.booking_id ? "border-amber-500 shadow-2xl" : "hover:border-stone-100 shadow-sm"
                  )}
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Hotel Image Section */}
                    <div className="w-full lg:w-72 h-56 lg:h-[240px] rounded-[1.5rem] overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-700 shrink-0">
                      {hotel?.image_url ? (
                        <img src={hotel.image_url} alt={hotel?.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-stone-100 flex items-center justify-center text-4xl">🏨</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border",
                            statusStyle.bg, statusStyle.text, statusStyle.border
                          )}>
                            {statusStyle.label}
                          </span>
                          <span className="text-[10px] font-bold text-stone-400 border border-stone-100 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            Ref: {booking.booking_reference}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl font-black text-stone-900 tracking-tight mb-4 group-hover:text-amber-600 transition-colors">
                          {hotel?.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Date & Duration</p>
                            <p className="text-sm font-bold text-stone-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-500" />
                              {format(new Date(booking.checkin_date), 'MMM dd')} - {format(new Date(booking.checkout_date), 'MMM dd, yyyy')}
                              <span className="ml-1 text-stone-400 font-medium">({nights} nights)</span>
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Location</p>
                            <p className="text-sm font-bold text-stone-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-stone-400" />
                              {hotel?.city}, {hotel?.address?.split(',').pop()?.trim() || 'Philippines'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Room</p>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-100 bg-stone-50">
                                {(() => {
                                  const roomTypeId = booking.booking_rooms?.[0]?.room?.room_type_id;
                                  const rt = roomTypes.find(type => type.room_type_id === roomTypeId);
                                  return rt?.image_url ? (
                                    <img src={rt.image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-200">
                                      <BedDouble size={16} />
                                    </div>
                                  );
                                })()}
                              </div>
                              <p className="text-sm font-bold text-stone-700 leading-tight">
                                {booking.booking_rooms?.[0]?.room?.room_type?.name || 'Standard Luxury'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Stay Investment</p>
                          <p className="text-3xl font-black text-stone-900">₱{Number(booking.total_cost || 0).toLocaleString()}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="h-12 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest group-hover:bg-stone-900 group-hover:text-white transition-all duration-300 gap-2 shadow-sm"
                        >
                          Booking Details
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border border-stone-200 shadow-2xl bg-white">
            <DialogTitle className="sr-only">Reservation Details for {selectedBooking.booking_reference}</DialogTitle>
            
            {/* Downloadable Area */}
            <div ref={pdfRef} className="bg-white pb-6 pt-0">
               {/* Modal Header */}
               <div className="bg-gradient-to-br from-stone-800 to-stone-900 px-6 py-8 text-white relative">
               <div className="absolute top-4 right-4" data-html2canvas-ignore>
                  <button onClick={() => setIsDetailsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                     <X size={16} />
                  </button>
               </div>
              
              <div className="flex items-center gap-2 mb-3">
                 <span className="text-[9px] font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full uppercase tracking-widest">
                    Reservation Receipt
                 </span>
                 <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    REF: {selectedBooking.booking_reference}
                 </span>
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                 {(selectedBooking.hotel || hotels.find(h => h.id === selectedBooking.hotel_id))?.name}
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-medium text-white/50 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-400/60" /> {(selectedBooking.hotel || hotels.find(h => h.id === selectedBooking.hotel_id))?.city}</span>
                 <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-400/60" /> {new Date(selectedBooking.checkin_date).toLocaleDateString()} — {new Date(selectedBooking.checkout_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6 max-h-[65vh] overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guest Info */}
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                        <User className="text-amber-500" size={14} />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Guest Information</h3>
                     </div>
                     <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Primary Guest</span>
                           <span className="font-bold text-stone-700">
                              {selectedBooking.notes?.match(/Guest: (.*?),/)?.[1] || user?.name}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Contact</span>
                           <span className="font-bold text-stone-700">{selectedBooking.notes?.match(/Phone: (.*?),/)?.[1] || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Email</span>
                           <span className="font-bold text-stone-700">{user?.email}</span>
                        </div>
                     </div>
                  </div>

                  {/* Room Info */}
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                        <BedDouble className="text-amber-500" size={14} />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Room & Stay</h3>
                     </div>
                     <div className="space-y-2.5">
                        <div className="flex items-center gap-4 mb-2">
                           <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
                              {(() => {
                                 const rtid = selectedBooking.room_type_id || (selectedBooking.booking_rooms && selectedBooking.booking_rooms[0]?.room?.room_type_id);
                                 const rt = roomTypes.find(type => type.room_type_id === rtid);
                                 return rt?.image_url ? (
                                    <img src={rt.image_url} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                                       <BedDouble size={20} />
                                    </div>
                                 );
                              })()}
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-bold text-stone-900 leading-tight">
                                 {selectedBooking.booking_rooms?.[0]?.room?.room_type?.name || 'Luxury Suite'}
                              </p>
                              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-1">
                                 {getNights(selectedBooking.checkin_date, selectedBooking.checkout_date)} Nights
                              </p>
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Room Assignment</span>
                           <span className="font-bold text-stone-700">
                              {(() => { const rid = selectedBooking.room_id || (selectedBooking.booking_rooms && selectedBooking.booking_rooms[0]?.room_id); const r = allRooms.find(rm => rm.room_id === rid); return r ? `Room ${r.room_number} (Floor ${r.floor})` : 'Awaiting Assignment'; })()}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Financial Summary */}
               <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                     <Receipt className="text-amber-500" size={14} />
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Financial Summary</h3>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                     <div className="flex justify-between items-center">
                        <div className="space-y-2 w-full max-w-[200px]">
                           <div className="flex justify-between items-center text-[10px]">
                              <span className="font-medium text-stone-600 uppercase tracking-wider">Method</span>
                              <span className="font-bold text-stone-600">{selectedBooking.notes?.match(/Payment: (.*?),/)?.[1] || 'Card'}</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px]">
                              <span className="font-medium text-stone-600 uppercase tracking-wider">Downpayment</span>
                              <span className="font-bold text-emerald-600">{selectedBooking.notes?.match(/Downpayment: (.*?),/)?.[1] || '₱0'}</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px]">
                              <span className="font-medium text-stone-600 uppercase tracking-wider">Balance</span>
                              <span className="font-bold text-amber-600">{selectedBooking.notes?.match(/Balance: (.*)/)?.[1] || '₱0'}</span>
                           </div>
                        </div>
                        
                        <div className="text-right border-l border-stone-200 pl-5">
                           <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mb-1">Total</p>
                           <p className="text-2xl font-black tracking-tight text-stone-900">₱{Number(selectedBooking.total_cost || 0).toLocaleString()}</p>
                           <p className="text-[9px] font-medium text-stone-600 mt-0.5">VAT INCLUDED</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Cancellation Policy */}
               <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-3">
                  <Info className="text-amber-500 shrink-0" size={16} />
                  <div>
                     <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Cancellation Policy</h4>
                     <p className="text-xs text-amber-700/70 leading-relaxed font-medium">
                        Cancellations processed before {new Date(new Date(selectedBooking.checkin_date).getTime() - 86400000).toLocaleDateString()} are eligible for a full downpayment refund.
                     </p>
                  </div>
               </div>
            </div>
            </div>

            <DialogFooter className="px-6 py-4 flex flex-col sm:flex-row items-center gap-3 border-t border-stone-100 bg-stone-50/50">
               <div className="flex-1 w-full flex justify-start">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="h-9 px-4 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 text-[10px] uppercase tracking-widest hover:bg-stone-50 shadow-sm"
                  >
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="ghost" 
                    className="h-9 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-stone-600 hover:text-stone-700 hover:bg-stone-100"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Dismiss
                  </Button>
                  
                  {canCancel(selectedBooking.checkin_date) && selectedBooking.booking_status !== 'cancelled' && (
                    <Button 
                      onClick={() => handleCancelBooking(selectedBooking.booking_id)}
                      disabled={isCancelling}
                      className="h-9 px-4 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      {isCancelling ? 'Processing...' : 'Cancel Booking'}
                    </Button>
                  )}
               </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
