import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Eye, Loader2, Search, Building2, Trash2, User, CalendarDays, CreditCard, Mail, Phone } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function AdminBookings() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const { bookings, hotels, guests, isLoading, updateBookingStatus, deleteBooking } = useBooking();

  if (isLoading) return <div className="h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-12 h-12" /></div>;

  const getStyle = (s: string) => {
    const map: Record<string, string> = { confirmed: 'bg-blue-50 text-blue-700', 'checked-in': 'bg-emerald-50 text-emerald-700', 'checked-out': 'bg-slate-50 text-slate-900', pending: 'bg-amber-50 text-amber-700', cancelled: 'bg-rose-50 text-rose-700' };
    return map[s] || 'bg-slate-50 text-slate-900';
  };

  const filtered = bookings.filter(b => {
    const guest = guests.find(g => g.id === b.guest_id);
    const hotel = hotels.find(h => h.id === b.hotel_id);
    const name = `${guest?.first_name} ${guest?.last_name}`.toLowerCase();
    const matchesSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) || hotel?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    const matchesHotel = hotelFilter === 'all' || b.hotel_id.toString() === hotelFilter;
    return matchesSearch && matchesStatus && matchesHotel;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const booking = bookings.find(b => b.booking_id === selectedId);
  const hotel = hotels.find(h => h.id === booking?.hotel_id);
  const guest = guests.find(g => g.id === booking?.guest_id);

  return (
    <div className="space-y-8 p-4 md:p-8 -m-4 md:-m-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Reservation Ledger</h1>
          <p className="text-sm font-bold text-slate-900">Track and manage property occupancy flow</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
          <input placeholder="Search reference, guest, or property..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold outline-none" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 px-6 min-w-[140px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white z-[200]">
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={hotelFilter} onValueChange={setHotelFilter}>
            <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 px-6 min-w-[180px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white z-[200]">
              <SelectItem value="all">All Properties</SelectItem>
              {hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-50">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest">
            <tr><th className="p-8">Booking Ref</th><th className="p-8">Guest & Property</th><th className="p-8">Check-in / Check-out</th><th className="p-8">Status</th><th className="p-8 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(b => (
              <tr key={b.booking_id} className="hover:bg-slate-50 group">
                <td className="p-8 font-black text-slate-900"><span className="bg-slate-100 px-3 py-1 rounded-lg">{b.booking_reference}</span></td>
                <td className="p-8 font-black text-slate-900">
                  {guests.find(g => g.id === b.guest_id)?.first_name} {guests.find(g => g.id === b.guest_id)?.last_name}
                  <p className="text-[9px] font-bold text-slate-900 mt-1 flex items-center gap-1.5 uppercase tracking-widest"><Building2 className="w-3 h-3" /> {hotels.find(h => h.id === b.hotel_id)?.name}</p>
                </td>
                <td className="p-8 text-xs font-bold text-slate-600"> {new Date(b.checkin_date).toLocaleDateString()} — {new Date(b.checkout_date).toLocaleDateString()} </td>
                <td className="p-8">
                  <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/10 ${getStyle(b.booking_status)}`}> {b.booking_status.replace('_', ' ')} </div>
                </td>
                <td className="p-8 text-right space-x-2">
                  <Button size="icon" onClick={() => setSelectedId(b.booking_id)} className="rounded-xl bg-slate-900 text-white hover:scale-110 transition-transform"> <Eye className="w-4 h-4" /> </Button>
                  <Button size="icon" onClick={() => { if (confirm("Purge reservation?")) deleteBooking(b.booking_id) }} className="rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"> <Trash2 className="w-4 h-4" /> </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedId} onOpenChange={o => !o && setSelectedId(null)}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-4xl bg-slate-50 rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl animate-dialog-popup">
          <DialogTitle className="sr-only">Booking Details</DialogTitle>
          <DialogDescription className="sr-only">Detailed view of the reservation</DialogDescription>
          <div className="bg-slate-900 p-8 md:p-10 text-white relative flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Reservation Intel</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    booking?.booking_status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                    booking?.booking_status === 'checked-in' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    booking?.booking_status === 'cancelled' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}> {booking?.booking_status.replace('_', ' ')} </span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tighter">{booking?.booking_reference}</h3>
            </div>
          </div>

          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[75vh]">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><User className="w-5 h-5" /></div><h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Guest Profile</h4></div>
                <p className="text-2xl font-black text-slate-900">{guest?.first_name} {guest?.last_name}</p>
                <div className="grid grid-cols-1 gap-2">
                  <p className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl"><Mail className="w-4 h-4 text-emerald-500" /> {guest?.email}</p>
                  <p className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl"><Phone className="w-4 h-4 text-emerald-500" /> {guest?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><CalendarDays className="w-5 h-5" /></div><h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Stay Details</h4></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Check In</p><p className="text-lg font-black text-slate-900">{booking ? new Date(booking.checkin_date).toLocaleDateString() : '---'}</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Check Out</p><p className="text-lg font-black text-slate-900">{booking ? new Date(booking.checkout_date).toLocaleDateString() : '---'}</p></div>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5" /></div><h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Financials</h4></div>
                <div className="bg-slate-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px]" />
                  <span className="text-xs font-black text-white uppercase tracking-widest relative z-10">Total Revenue</span>
                  <div className="flex items-baseline gap-1 relative z-10"><span className="text-base font-black text-emerald-400">₱</span><span className="text-3xl font-black text-white tracking-tighter">{Number(booking?.total_cost || 0).toLocaleString()}</span></div>
                </div>
                
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">State Control</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'] as const).map(s => {
                      const isActive = booking?.booking_status === s;
                      let activeClass = '';
                      if (isActive) {
                        if (s === 'pending') activeClass = 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-500';
                        else if (s === 'confirmed') activeClass = 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-emerald-500';
                        else if (s === 'checked-in') activeClass = 'bg-blue-500 text-white shadow-md shadow-blue-500/20 border-blue-500';
                        else if (s === 'checked-out') activeClass = 'bg-slate-700 text-white shadow-md shadow-slate-700/20 border-slate-700';
                        else if (s === 'cancelled') activeClass = 'bg-rose-500 text-white shadow-md shadow-rose-500/20 border-rose-500';
                      }
                      return (
                        <button key={s} onClick={() => updateBookingStatus(booking!.booking_id, s)} className={`py-2 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${isActive ? activeClass : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'}`}> {s.replace('-', ' ')} </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 overflow-hidden flex-shrink-0">
                  {hotel?.image_url ? <img src={hotel.image_url} className="w-full h-full object-cover" /> : <Building2 className="w-full h-full p-4 text-slate-300" />}
                </div>
                <div><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Property</p><p className="text-lg font-black text-slate-900">{hotel?.name}</p></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
