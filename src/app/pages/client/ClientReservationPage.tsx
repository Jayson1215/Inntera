import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Home, 
  Mail, 
  Phone, 
  ArrowLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function ClientReservationPage() {
  const { hotelId, roomTypeId } = useParams();
  const navigate = useNavigate();
  const { createBooking, rooms: allRooms, hotels, roomTypes, isLoading } = useBooking();
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  
  const [guestFirstName, setGuestFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [guestLastName, setGuestLastName] = useState(user?.name?.split(' ')[1] || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hotel = hotels.find(h => h.id === parseInt(hotelId || '0'));
  const roomType = roomTypes.find(rt => rt.room_type_id === parseInt(roomTypeId || '0'));

  useEffect(() => {
    if (!isLoading && (!hotel || !roomType)) {
      toast.error("Destination or room type not found. Returning to search.");
      navigate('/client/search');
    }
  }, [hotel, roomType, navigate, isLoading]);

  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    if (date) {
      const checkInDate = new Date(date);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      const checkOutFormatted = checkOutDate.toISOString().split('T')[0];
      setCheckOut(checkOutFormatted);
    }
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!guestFirstName || !guestLastName || !guestEmail || !guestPhone || !guestAddress) {
      toast.error('Please fill in all guest details');
      return;
    }

    setIsSubmitting(true);
    
    // Find an available room for the selected type and hotel from the LATEST context data
    const targetRoom = allRooms.find(r => 
      r.room_type_id === parseInt(roomTypeId || '0') && 
      r.hotel_id === parseInt(hotelId || '0') &&
      r.status === 'available'
    ) || allRooms.find(r => 
      r.room_type_id === parseInt(roomTypeId || '0') && 
      r.hotel_id === parseInt(hotelId || '0')
    );

    if (!targetRoom) {
      toast.error('No rooms found for this suite type');
      setIsSubmitting(false);
      return;
    }

    const nightlyRate = Number(roomType?.base_price || 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = nightlyRate * numNights;
    
    const bookingData = {
      hotel_id: hotel?.id,
      guest_id: user?.id || 999,
      checkin_date: checkInDate.toISOString(),
      checkout_date: checkOutDate.toISOString(),
      total_cost: totalCost,
      notes: `Guest: ${guestFirstName} ${guestLastName}, Phone: ${guestPhone}, Address: ${guestAddress}, Payment: ${paymentMethod}`,
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
        amount: totalCost
      }
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      toast.success('Your reservation has been confirmed!');
      setTimeout(() => navigate('/client/bookings'), 2000);
    } else {
      toast.error(result.error || 'Failed to complete reservation');
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-emerald-600 font-serif">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Securing your connection...</p>
      </div>
    );
  }

  if (!hotel || !roomType) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-0">
      {/* Breadcrumb & Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to={`/client/hotel/${hotelId}`} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to {hotel.name}
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Secure Your Stay</h1>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <Clock className="w-3 h-3" />
          Held for 15:00
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Stay Details */}
          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">1</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Stay Details</h3>
                <p className="text-sm text-slate-500">Pick your dates and group size</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Check-in Date</Label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Check-out Date</Label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : ''}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adults</Label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Children</Label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Guest Information */}
          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">2</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Guest Information</h3>
                <p className="text-sm text-slate-500">How should we contact you?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                <Input
                  placeholder="John"
                  value={guestFirstName}
                  onChange={(e) => setGuestFirstName(e.target.value)}
                  className="h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={guestLastName}
                  onChange={(e) => setGuestLastName(e.target.value)}
                  className="h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Home Address</Label>
                <div className="relative group">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-50 focus:border-emerald-500 rounded-2xl font-bold bg-slate-50/50"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Payment */}
          <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">3</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Payment Option</h3>
                <p className="text-sm text-slate-500">Choose your preferred payment method</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'GCash', label: 'GCash', icon: '📱', color: 'text-blue-600', sub: 'Fast & Secure' },
                { id: 'PayPal', label: 'PayPal', icon: '🅿️', color: 'text-blue-800', sub: 'Global Standard' },
                { id: 'PayMaya', label: 'PayMaya', icon: '💳', color: 'text-emerald-500', sub: 'Instant Payment' },
                { id: 'Pay at Hotel (Card)', label: 'Pay at Hotel (Card)', icon: '🏨', color: 'text-slate-600', sub: 'Pay on arrival' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                    paymentMethod === method.id 
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-inner' 
                      : 'border-slate-50 hover:border-slate-100 bg-slate-50/30'
                  }`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <div className="text-left">
                    <p className={`text-sm font-black uppercase tracking-widest mb-1 ${
                      paymentMethod === method.id ? method.color : 'text-slate-500'
                    }`}>
                      {method.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">{method.sub}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-4 flex items-center gap-6">
            <Button 
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex-1 h-20 bg-slate-900 hover:bg-slate-800 text-white font-black text-xl rounded-3xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/20 border-b-white"></div>
                  CONFIRMING...
                </>
              ) : (
                <>
                  CONFIRM RESERVATION
                  <ChevronRight className="w-6 h-6" />
                </>
              )}
            </Button>
            <div className="w-48 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">
              By confirming, you agree to our <span className="text-emerald-600 cursor-pointer">Terms & Conditions</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-2 border-emerald-500 overflow-hidden shadow-2xl sticky top-24 transform rotate-1">
            <div className="h-48 bg-emerald-600 flex items-center justify-center text-8xl">
              🏨
            </div>
            <CardContent className="p-8 bg-white border-none">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 border-none" />
                ))}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">{hotel.name}</h2>
              <p className="text-slate-500 font-bold flex items-center gap-2 text-sm mb-8">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {hotel.city}, {hotel.address}
              </p>

              <div className="space-y-6 pb-8 border-b border-slate-100 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suite Type</p>
                    <p className="font-bold text-slate-800">{roomType.name}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold">Luxe</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-600" /> {adults} G</div>
                  <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Insured</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Standard Rate</span>
                  <span>₱{roomType.base_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Taxes & Fees</span>
                  <span>₱0</span>
                </div>
                <div className="flex justify-between items-center pt-4 text-slate-900 font-black text-3xl tracking-tighter italic">
                  <span>TOTAL</span>
                  <span className="text-emerald-600">₱{roomType.base_price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 -rotate-1">
            <h4 className="font-bold text-emerald-900 mb-2">Inntera Guarantee</h4>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Your reservation is protected by our global security standards. No hidden fees, instant confirmation, and 24/7 support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
