import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar, MapPin, Clock, Search, BedDouble, CreditCard, ChevronRight, X, AlertCircle, CheckCircle2, Receipt, Info, ShieldCheck, User, Phone, Mail, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { toast } from 'sonner';

export function ClientBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings: contextBookings, hotels, deleteBooking, rooms: allRooms } = useBooking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const highlightedId = location.state?.highlightedBookingId;
  const bookingRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pdfRef = useRef<HTMLDivElement>(null);

  const userBookings = contextBookings.filter(b => b.guest_id === user?.id);

  useEffect(() => {
    if (highlightedId && bookingRefs.current[highlightedId]) {
      bookingRefs.current[highlightedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId, userBookings]);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'checked-in'].includes(b.booking_status);
    if (activeTab === 'past') return ['checked-out', 'cancelled'].includes(b.booking_status);
    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmed' };
      case 'checked-in': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Checked In' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' };
      case 'checked-out': return { bg: 'bg-stone-100', text: 'text-stone-500', border: 'border-stone-200', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Cancelled' };
      default: return { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200', label: status };
    }
  };

  const getNights = (checkin: string, checkout: string) => {
    const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? If cancelled before the check-in date, your downpayment will be refunded.')) return;
    
    setIsCancelling(true);
    const result = await deleteBooking(id);
    setIsCancelling(false);
    
    if (result.success) {
      toast.success('Reservation cancelled successfully. Refund processing initialized.');
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
    <div className="bg-[#FAFAF8] -mt-8 -mx-4 md:-mx-8 lg:-mx-12 min-h-screen px-4 md:px-8 lg:px-12 py-10 font-sans">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">My Reservations</h1>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em] mt-1">{userBookings.length} TOTAL BOOKINGS</p>
        </div>

        <div className="bg-white p-1 rounded-xl shadow-sm border border-stone-200/60 flex items-center">
           {(['all', 'upcoming', 'past'] as const).map(tab => (
             <button
              key={tab}
              onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/15' : 'text-stone-500 hover:text-stone-900'
              }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* List Area */}
      <div className="max-w-5xl mx-auto space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-stone-200 py-32 text-center shadow-sm">
             <Calendar className="w-16 h-16 mx-auto mb-6 text-stone-200" />
             <h3 className="text-xl font-bold text-stone-900">No Reservations Found</h3>
             <p className="text-xs text-stone-600 max-w-xs mx-auto mt-2 leading-relaxed">Your next premium stay is just a few clicks away.</p>
             <button 
              onClick={() => navigate('/client/search')}
              className="mt-8 h-12 px-10 bg-amber-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-amber-700 transition-all shadow-lg active:scale-95"
             >
                Start Exploring
             </button>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
            const statusStyle = getStatusStyles(booking.booking_status);
            const nights = getNights(booking.checkin_date, booking.checkout_date);

            return (
              <div 
                key={booking.booking_id}
                onClick={() => { setSelectedBooking(booking); setIsDetailsOpen(true); }}
                className={cn(
                  "bg-white rounded-2xl border border-stone-100 p-6 md:p-8 cursor-pointer group hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-200 transition-all duration-300 hover:-translate-y-0.5",
                  highlightedId === booking.booking_id && "ring-2 ring-amber-500 shadow-2xl border-transparent"
                )}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                   <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-stone-100 group-hover:border-amber-200 transition-colors">
                         {hotel?.image_url ? (
                           <img src={hotel.image_url} alt="" className="w-full h-full object-cover" />
                         ) : <span className="text-2xl">🏨</span>}
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                               "text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border",
                               statusStyle.bg, statusStyle.text, statusStyle.border
                            )}>
                               {statusStyle.label}
                            </span>
                            <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">REF: {booking.booking_reference}</span>
                         </div>
                         <h3 className="text-lg font-bold text-stone-900 tracking-tight">{hotel?.name}</h3>
                         <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium text-stone-600">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-500" /> {new Date(booking.checkin_date).toLocaleDateString()} — {new Date(booking.checkout_date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-stone-600" /> {nights} nights</span>
                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-stone-600" /> {hotel?.city}</span>
                         </div>
                      </div>
                   </div>

                    <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-50 gap-4">
                       <div className="text-left lg:text-right">
                          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1">Total</p>
                          <p className="text-2xl font-black text-stone-900 tracking-tighter">₱{Number(booking.total_cost || 0).toLocaleString()}</p>
                       </div>
                       <Button variant="outline" className="h-10 px-6 bg-white border border-stone-200 text-stone-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 shadow-sm transition-all">View Details</Button>
                    </div>
                </div>
              </div>
            );
          })
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
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Suite Details</span>
                           <span className="font-bold text-stone-700">Premium Suite</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Room Assignment</span>
                           <span className="font-bold text-stone-700">
                              {(() => { const rid = selectedBooking.room_id || (selectedBooking.booking_rooms && selectedBooking.booking_rooms[0]?.room_id); const r = allRooms.find(rm => rm.room_id === rid); return r ? `Room ${r.room_number} (Floor ${r.floor})` : 'Awaiting Assignment'; })()}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-medium text-stone-600">Duration</span>
                           <span className="font-bold text-stone-700">{getNights(selectedBooking.checkin_date, selectedBooking.checkout_date)} Nights</span>
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
