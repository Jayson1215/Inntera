import { useState } from 'react';
import { Building2, BedDouble, Calendar, Users, DollarSign, TrendingUp, Activity, ArrowUpRight, Loader2, X, MapPin, Eye } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '../../components/ui/dialog';

export function AdminDashboard() {
  const { hotels, rooms, bookings, guests, isLoading } = useBooking();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) return <div className="h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500 w-12 h-12" /></div>;

  const totalRev = bookings.reduce((s, b) => s + (parseFloat(String(b.total_cost || 0))), 0);
  const avail = rooms.filter(r => r.status === 'available').length;
  const occ = rooms.length > 0 ? Math.round((rooms.length - avail) / rooms.length * 100) : 0;
  
  const stats = [
    { t: 'Assets', v: hotels.length, i: Building2, c: 'text-indigo-600', b: 'bg-indigo-50' },
    { t: 'Inventory', v: rooms.length, s: `${avail} Avail`, i: BedDouble, c: 'text-emerald-600', b: 'bg-emerald-50' },
    { t: 'Active', v: bookings.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'checked-in').length, s: `${bookings.length} Total`, i: Calendar, c: 'text-amber-600', b: 'bg-amber-50' },
    { t: 'Registry', v: guests.length, i: Users, c: 'text-blue-600', b: 'bg-blue-50' },
    { t: 'Revenue', v: `₱${totalRev.toLocaleString()}`, i: DollarSign, c: 'text-emerald-600', b: 'bg-emerald-50' },
    { t: 'Occupancy', v: `${occ}%`, i: TrendingUp, c: 'text-slate-900', b: 'bg-slate-50' },
  ];

  const selectedBooking = bookings.find(b => b.booking_id === selectedId);
  const selectedGuest = guests.find(g => g.id === selectedBooking?.guest_id);
  const selectedHotel = hotels.find(h => h.id === selectedBooking?.hotel_id);

  return (
    <div className="space-y-8 p-4 md:p-8 -m-4 md:-m-8 bg-[#f8fafc] min-h-screen">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm hover:-translate-y-1 transition-all relative overflow-hidden group border border-slate-100">
            <div className="flex justify-between">
              <div> <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.t}</p> <p className="text-3xl font-black text-slate-900 tracking-tight">{s.v}</p> {s.s && <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{s.s}</p>} </div>
              <div className={`w-14 h-14 rounded-2xl ${s.b} ${s.c} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`}> <s.i className="w-7 h-7" /> </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div> <h2 className="text-2xl font-black text-slate-900">Transaction Feed</h2> <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time updates</p> </div>
            <Link to="/admin/bookings"> <Button variant="ghost" className="rounded-xl bg-slate-50 font-black text-[10px] uppercase tracking-widest px-6 h-12 hover:bg-slate-900 hover:text-white transition-all">View All</Button> </Link>
          </div>
          <div className="space-y-4">
            {[...bookings].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5).map(b => {
              const guest = guests.find(g => g.id === b.guest_id);
              return (
                <div key={b.booking_id} onClick={() => setSelectedId(b.booking_id)} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs">{b.booking_reference.slice(0, 2)}</div>
                    <div> 
                      <p className="text-sm font-black text-slate-900">{guest ? `${guest.first_name} ${guest.last_name}` : b.booking_reference}</p> 
                      <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mt-1">₱{Number(b.total_cost).toLocaleString()} • {b.booking_reference}</p> 
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${b.booking_status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}> {b.booking_status.replace('_', ' ')} </div>
                    <Eye className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px]" />
            <h2 className="text-xl font-black text-white mb-6">Quick Ops</h2>
            <div className="space-y-3">
              {[ { l: 'Assets', p: '/admin/hotels', i: Building2 }, { l: 'Personnel', p: '/admin/staff', i: Users }, { l: 'Inventory', p: '/admin/rooms', i: BedDouble } ].map((l, i) => (
                <Link key={i} to={l.p} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                  <div className="flex items-center gap-3"> <l.i className="w-5 h-5 text-indigo-400" /> <span className="text-[10px] font-black text-white uppercase tracking-widest">{l.l}</span> </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6"> <Activity className="w-5 h-5 text-indigo-500" /> <h2 className="text-lg font-black text-slate-900">System Health</h2> </div>
            <div className="space-y-4">
               <div> <div className="flex justify-between text-[9px] font-black uppercase mb-1"> <span className="text-slate-900">Database</span> <span className="text-emerald-500">Online</span> </div> <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full" /></div> </div>
               <div> <div className="flex justify-between text-[9px] font-black uppercase mb-1"> <span className="text-slate-900">Occupancy</span> <span className="text-indigo-500">{occ}%</span> </div> <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${occ}%` }} /></div> </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedId} onOpenChange={o => !o && setSelectedId(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
            <h3 className="text-3xl font-black">Transaction Detail</h3>
            <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Guest Profile</p>
...
                <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Revenue Status</p>
                <div className="inline-flex px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 mt-2">
                  ₱{Number(selectedBooking?.total_cost).toLocaleString()} • {selectedBooking?.booking_status.replace('_', ' ')}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white flex-shrink-0">
                <img src={selectedHotel?.image_url} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{selectedHotel?.name}</p>
                <p className="text-[10px] font-bold text-slate-900 flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {selectedHotel?.address}
                </p>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">
                  Stay: {selectedBooking && new Date(selectedBooking.checkin_date).toLocaleDateString()} — {selectedBooking && new Date(selectedBooking.checkout_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Link to="/admin/bookings" className="text-[10px] font-black text-slate-900 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors">Go to full Ledger →</Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
