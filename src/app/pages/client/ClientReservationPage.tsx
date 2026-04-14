import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  MapPin, 
  Users, 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Calendar as CalendarIcon,
  CreditCard,
  Wallet,
  Lock
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { cn } from '../../lib/utils';

export function ClientReservationPage() {
  const { hotelId, roomTypeId } = useParams();
  const navigate = useNavigate();
  const { createBooking, rooms: allRooms, hotels, roomTypes, isLoading } = useBooking();
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 1));
  const [adults] = useState('2');
  const [children] = useState('0');
  
  const [guestFirstName, setGuestFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [guestLastName, setGuestLastName] = useState(user?.name?.split(' ')[1] || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [discountType, setDiscountType] = useState<'None' | 'Senior' | 'PWD'>('None');
  const [idNumber, setIdNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hotel = hotels.find(h => h.id === parseInt(hotelId || '0'));
  const roomType = roomTypes.find(rt => rt.room_type_id === parseInt(roomTypeId || '0'));

  useEffect(() => {
    if (!isLoading && (!hotel || !roomType)) {
      toast.error("Destination or room type not found.");
      navigate('/client/search');
    }
  }, [hotel, roomType, navigate, isLoading]);

  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.split(' ');
        if (!guestFirstName) setGuestFirstName(parts[0] || '');
        if (!guestLastName) setGuestLastName(parts.slice(1).join(' ') || '');
      }
      if (user.email && !guestEmail) setGuestEmail(user.email);
    }
  }, [user]);

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date);
    if (date) {
      if (!checkOut || differenceInDays(checkOut, date) <= 0) {
        setCheckOut(addDays(date, 1));
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const missingFields = [];
    if (!guestFirstName.trim()) missingFields.push('First Name');
    if (!guestLastName.trim()) missingFields.push('Last Name');
    if (!guestEmail.trim()) missingFields.push('Email Address');
    if (!guestPhone.trim()) missingFields.push('Phone Number');
    if (!guestAddress.trim()) missingFields.push('Full Address');

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    if (discountType !== 'None' && !idNumber) {
      toast.error('Please provide a valid ID Number for the discount');
      return;
    }

    setIsSubmitting(true);
    
    const targetRoom = allRooms.find(r => 
      r.room_type_id === parseInt(roomTypeId || '0') && 
      r.hotel_id === parseInt(hotelId || '0') &&
      r.status === 'available'
    );

    if (!targetRoom) {
      toast.error('⚠️ This room is no longer available. Please go back and select another room.');
      setIsSubmitting(false);
      return;
    }

    if (!roomType) {
      toast.error('Room type information not loaded. Please refresh and try again.');
      setIsSubmitting(false);
      return;
    }

    const nightlyRate = Number(roomType?.base_price || 0);
    const numNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1;
    
    if (numNights <= 0) {
      toast.error('Check-out date must be after check-in date');
      setIsSubmitting(false);
      return;
    }
    
    const baseTotal = nightlyRate * numNights;
    const discountAmount = discountType !== 'None' ? baseTotal * 0.20 : 0;
    const finalTotal = baseTotal - discountAmount;
    const downpaymentAmount = finalTotal * 0.30;
    
    if (finalTotal < 1 || downpaymentAmount < 1) {
      toast.error('Booking total must be at least ₱1');
      setIsSubmitting(false);
      return;
    }
    
    const bookingData = {
      // Don't send guest_id if it's actually a user.id and not a guest_id
      // The backend will find/create the guest using guest_details.email
      guest_id: null,
      hotel_id: hotel?.id,
      checkin_date: checkIn?.toISOString(),
      checkout_date: checkOut?.toISOString(),
      total_cost: finalTotal,
      notes: `Guest: ${guestFirstName} ${guestLastName}, Phone: ${guestPhone}, Address: ${guestAddress}, Payment: ${paymentMethod}, Discount: ${discountType} ${idNumber ? `(ID: ${idNumber})` : ''}, Downpayment: ₱${downpaymentAmount.toLocaleString()}, Balance: ₱${(finalTotal - downpaymentAmount).toLocaleString()}`,
      rooms: [
        {
          room_id: targetRoom.room_id,
          adults_count: parseInt(adults),
          children_count: parseInt(children),
          rate: nightlyRate,
          number_of_nights: numNights
        }
      ],
      guest_details: {
        first_name: guestFirstName,
        last_name: guestLastName,
        email: guestEmail,
        phone: guestPhone,
        address: guestAddress
      },
      payment: {
        method: paymentMethod,
        amount: downpaymentAmount,
        status: 'pending',
        transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        notes: `Downpayment (30%) for ${roomType?.name || 'room'}. ${discountType !== 'None' ? `${discountType} discount applied (20%, ID: ${idNumber}).` : 'No discount.'} Payment via ${paymentMethod}. Balance: ₱${(finalTotal - downpaymentAmount).toLocaleString()}.`
      }
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      toast.success('Your reservation has been submitted! Status: Pending Admin Review');
      setTimeout(() => navigate('/client/bookings'), 2000);
    } else {
      const errorMsg = result.error || 'Failed to complete reservation';
      console.error('Booking error:', errorMsg);
      toast.error(errorMsg);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
        <p className="text-stone-600 font-medium animate-pulse tracking-wide">Securing your reservation...</p>
      </div>
    );
  }

  if (!hotel || !roomType) return null;

  const numNights = checkIn && checkOut ? Math.max(1, differenceInDays(checkOut, checkIn)) : 1;
  const baseTotal = Number(roomType.base_price) * numNights;
  const finalTotal = baseTotal * (discountType !== 'None' ? 0.8 : 1);
  const downpayment = finalTotal * 0.3;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20 font-sans -mt-8 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-10">
      {/* Header Bar */}
      <div className="bg-white border border-stone-100 sticky top-0 z-40 backdrop-blur-md rounded-2xl shadow-sm mb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
           <Link to={`/client/hotel/${hotelId}`} className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-600 transition-all group">
              <div className="p-2 bg-stone-50 rounded-full group-hover:bg-amber-50 transition-colors border border-stone-100 group-hover:border-amber-200">
                 <ArrowLeft size={16} />
              </div>
              <span>Back to Selection</span>
           </Link>
           
           <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-amber-500/15">1</div>
                 <span className="text-sm font-bold text-stone-700">Reservation Details</span>
              </div>
              <div className="w-10 h-px bg-stone-200"></div>
              <div className="flex items-center gap-3 opacity-40">
                 <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold">2</div>
                 <span className="text-sm font-bold text-stone-600">Confirmation</span>
              </div>
           </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Secure Checkout</span>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Guest Details */}
            <section className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900">Guest Information</h2>
                  <p className="text-stone-600 text-sm mt-2">Primary person checking in.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <Users className="text-amber-600 w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">First Name</Label>
                  <Input 
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.target.value)}
                    placeholder="John"
                    className="h-12 border-stone-200 focus:ring-amber-500 focus:border-amber-200 rounded-xl font-medium bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Last Name</Label>
                  <Input 
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    placeholder="Doe"
                    className="h-12 border-stone-200 focus:ring-amber-500 focus:border-amber-200 rounded-xl font-medium bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Email Address</Label>
                  <Input 
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="h-12 border-stone-200 focus:ring-amber-500 focus:border-amber-200 rounded-xl font-medium bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Phone Number</Label>
                  <Input 
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="h-12 border-stone-200 focus:ring-amber-500 focus:border-amber-200 rounded-xl font-medium bg-stone-50"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">Full Address</Label>
                  <Input 
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    placeholder="123 Mabini St., Manila"
                    className="h-12 border-stone-200 focus:ring-amber-500 focus:border-amber-200 rounded-xl font-medium bg-stone-50"
                  />
                </div>
              </div>
            </section>

            {/* Discounts */}
            <section className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900">Special Discounts</h2>
                  <p className="text-stone-600 text-sm mt-2">For Senior Citizens and PWD.</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Star className="text-emerald-500 w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'None', label: 'Regular Rate', sub: 'No discount' },
                    { id: 'Senior', label: 'Senior Citizen', sub: '20% Off' },
                    { id: 'PWD', label: 'PWD Holder', sub: '20% Off' },
                  ].map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setDiscountType(type.id as any)}
                      className={cn(
                        "flex flex-col items-start gap-2 p-4 rounded-2xl border transition-all relative overflow-hidden",
                        discountType === type.id 
                          ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400' 
                          : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                      )}
                    >
                      <span className={cn(
                        "text-xs font-bold leading-none",
                        discountType === type.id ? 'text-emerald-700' : 'text-stone-700'
                      )}>{type.label}</span>
                      <span className="text-[10px] text-stone-600 font-medium uppercase tracking-widest">{type.sub}</span>
                      {discountType === type.id && (
                        <div className="absolute -right-1 -bottom-1">
                          <CheckCircle2 size={32} className="text-emerald-400/20" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {discountType !== 'None' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-1">ID Card Number</Label>
                    <Input 
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter Senior/PWD ID Number"
                      className="h-12 border-stone-200 focus:ring-emerald-500 rounded-xl font-medium bg-stone-50"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900">Payment Method</h2>
                  <p className="text-stone-600 text-sm mt-2">Select your preferred settlement.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <CreditCard className="text-amber-600 w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'Cash', label: 'Cash Payment', icon: <Wallet size={20} />, sub: 'Pay at the hotel' },
                  { id: 'Credit/Debit Card', label: 'Credit/Debit Card', icon: <CreditCard size={20} />, sub: 'Online payment' },
                ].map(method => (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-start gap-4 p-5 rounded-2xl border transition-all relative group",
                      paymentMethod === method.id 
                        ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50 shadow-md shadow-amber-500/5' 
                        : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      paymentMethod === method.id ? 'bg-amber-600 text-white scale-105 shadow-xl shadow-amber-500/15' : 'bg-white text-stone-600 border border-stone-100'
                    )}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-700 leading-none">{method.label}</p>
                      <p className="text-xs text-stone-600 font-medium mt-1.5 leading-none">{method.sub}</p>
                    </div>
                    {paymentMethod === method.id && (
                       <div className="absolute top-5 right-5">
                          <CheckCircle2 size={18} className="text-amber-600" />
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Cancellation Info */}
            <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
               <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-2xl md:flex-1">
                  <Lock className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                    Refundable Cancellation: You can cancel and receive a full refund of your downpayment before the check-in date.
                  </p>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/30 overflow-hidden">
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={hotel.image_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={hotel.name}
                    className="w-full h-full object-cover brightness-[0.4]"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{hotel.name}</h3>
                    <p className="text-[10px] font-medium text-white/60 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {hotel.city}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Room Image in Sidebar */}
                  <div className="rounded-2xl overflow-hidden h-32 relative group">
                    {roomType.image_url ? (
                      <img 
                        src={roomType.image_url} 
                        alt={roomType.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-50 flex items-center justify-center text-4xl opacity-20">🛏️</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex flex-col">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{roomType.bed_type}</span>
                      <span className="text-sm font-bold text-white tracking-tight leading-none mt-1">{roomType.name}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                       <Badge className="bg-amber-600/90 backdrop-blur-md text-white border-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Premium Suite</Badge>
                    </div>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-px bg-stone-100 rounded-2xl overflow-hidden border border-stone-100">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="bg-white p-4 cursor-pointer hover:bg-stone-50 transition-colors">
                          <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-2 leading-none">Check-in</p>
                          <div className="flex items-center gap-2">
                             <CalendarIcon size={14} className="text-amber-500" />
                             <p className="text-sm font-bold text-stone-700 leading-none">
                                {checkIn ? format(checkIn, 'MMM dd') : 'Select'}
                             </p>
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white shadow-2xl rounded-2xl border-stone-200 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={handleCheckInChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className="p-4"
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="bg-white p-4 cursor-pointer hover:bg-stone-50 transition-colors">
                          <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-2 leading-none">Check-out</p>
                          <div className="flex items-center gap-2">
                             <CalendarIcon size={14} className="text-stone-400" />
                             <p className="text-sm font-bold text-stone-700 leading-none">
                                {checkOut ? format(checkOut, 'MMM dd') : 'Select'}
                             </p>
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white shadow-2xl rounded-2xl border-stone-200 z-[100]" align="end">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          initialFocus
                          disabled={(date) => checkIn ? date <= checkIn : date < new Date()}
                          className="p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Room Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                        {roomType.room_type_id}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-700 leading-tight">{roomType.name}</p>
                        <p className="text-[10px] font-medium text-stone-600 mt-1 leading-none">{adults} Adults, {children} Children</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600 font-medium">Subtotal ({numNights} night{numNights > 1 ? 's' : ''})</span>
                        <span className="font-bold text-stone-700 font-mono">₱{baseTotal.toLocaleString()}</span>
                      </div>
                      {discountType !== 'None' && (
                        <div className="flex justify-between text-sm text-emerald-600 font-bold">
                          <span>{discountType} Discount (20%)</span>
                          <span>-₱{(baseTotal * 0.2).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-3 border-t border-dashed border-stone-100">
                        <span className="font-bold text-stone-700">Total</span>
                        <span className="font-black text-stone-900">₱{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Downpayment */}
                  <div className="pt-6 border-t border-stone-100 space-y-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest leading-none">Downpayment (30%)</span>
                        <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Required</span>
                      </div>
                      <div className="flex items-baseline gap-1 text-amber-700 font-black">
                        <span className="text-lg">₱</span>
                        <span className="text-3xl tracking-tighter">{downpayment.toLocaleString()}</span>
                      </div>
                      <p className="text-[9px] font-medium text-stone-600 uppercase mt-2 tracking-widest">Balance ₱{(finalTotal - downpayment).toLocaleString()} at {paymentMethod === 'Cash' ? 'hotel' : 'checkout'}</p>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleConfirmBooking}
                      disabled={isSubmitting}
                      className={cn(
                        "w-full h-14 rounded-2xl font-bold uppercase tracking-wide text-xs transition-all shadow-lg active:scale-95 group",
                        isSubmitting ? "bg-stone-100 text-stone-600" : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/15"
                      )}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span>Processing</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <span>Confirm Reservation</span>
                           <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                    <div className="flex justify-center gap-2 mt-5">
                       <ShieldCheck size={12} className="text-emerald-500" />
                       <p className="text-[10px] text-stone-600 font-medium">
                         Secure 256-bit encryption
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="bg-stone-800 rounded-3xl p-6 text-white overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform" />
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3 leading-none">Support</p>
                <h4 className="text-sm font-bold mb-1">Questions about this stay?</h4>
                <p className="text-xs text-stone-600 mb-4 leading-relaxed">Our team is available 24/7 to assist you.</p>
                <div className="inline-flex items-center gap-2 text-xs font-bold py-2 border-b-2 border-amber-500/40 hover:border-amber-500 transition-all text-amber-400">
                  <span>Chat with an advisor</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
