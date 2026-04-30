import { useEffect } from 'react';
import { Calendar, BedDouble, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Guest } from '../../types';

export function StaffDashboard() {
  const { bookings, rooms, guests, hotels, cleaningAssignments, isLoading, refreshData } = useBooking();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-teal-500 animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-semibold text-stone-900 tracking-widest uppercase animate-pulse">Loading Operations...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(b => b.checkin_date.split('T')[0] === today && b.booking_status === 'confirmed').length;
  const todayCheckOuts = bookings.filter(b => b.checkout_date.split('T')[0] === today && b.booking_status === 'checked-in').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  const activeCleaning = cleaningAssignments.filter(ca => ca.status !== 'completed').length;
  const activeBookings = bookings.filter(b => b.booking_status === 'confirmed' || b.booking_status === 'checked-in').length;

  const stats = [
    { title: 'Today Check-ins', value: todayCheckIns, icon: Calendar, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Today Check-outs', value: todayCheckOuts, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Available Rooms', value: availableRooms, icon: BedDouble, gradient: 'from-violet-500 to-violet-600' },
    { title: 'Occupied Rooms', value: occupiedRooms, icon: Clock, gradient: 'from-emerald-500 to-emerald-600' },
    { title: 'Active Cleaning', value: activeCleaning, icon: Sparkles, gradient: 'from-teal-500 to-teal-600' },
  ];

  const upcomingCheckIns = bookings
    .filter(b => b.booking_status === 'confirmed' || b.booking_status === 'pending')
    .sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-black rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-stone-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight">Operations Dashboard</h1>
          <p className="text-emerald-50/70 mt-2 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <span className="mx-3 opacity-30">•</span>
            <strong className="text-white">{activeBookings}</strong> active bookings
            <span className="mx-3 opacity-30">•</span>
            <strong className="text-white">{rooms.length}</strong> total rooms
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-2 transition-all duration-500 group"
              style={{ animationDelay: `${100 + index * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-stone-900 tracking-tighter">{stat.value}</p>
              <p className="text-[11px] font-bold text-stone-900 mt-1 uppercase tracking-widest">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Room Status Overview + Upcoming Check-ins */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Room Status */}
        <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm" style={{ animationDelay: '400ms' }}>
          <h2 className="font-black text-stone-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-stone-100 rounded-xl">
               <BedDouble className="w-5 h-5 text-stone-500" />
            </div>
            Room Overview
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-900 font-bold">Available</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rooms.length > 0 ? (availableRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-black text-stone-900 w-8 text-right">{availableRooms}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-900 font-bold">Occupied</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-black text-stone-900 w-8 text-right">{occupiedRooms}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-900 font-bold">Maintenance</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rooms.length > 0 ? (maintenanceRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-black text-stone-900 w-8 text-right">{maintenanceRooms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Check-ins */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm" style={{ animationDelay: '500ms' }}>
          <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h2 className="font-black text-stone-900 flex items-center gap-3">
              <div className="p-2 bg-stone-100 rounded-xl">
                 <Calendar className="w-5 h-5 text-stone-900" />
              </div>
              Upcoming Check-ins
            </h2>
            <span className="text-[10px] text-stone-900 font-bold uppercase tracking-widest">{upcomingCheckIns.length} pending</span>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingCheckIns.map((booking, index) => {
              const guest = guests.find((g: Guest) => g.id === booking.guest_id);
              const hotel = booking.hotel || hotels.find(h => h.id === booking.hotel_id);
              return (
                <div key={booking.booking_id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                      {guest?.first_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-stone-900 tracking-tight">{guest?.first_name} {guest?.last_name}</p>
                      <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest mt-0.5">{booking.booking_reference} <span className="mx-1 text-stone-200">•</span> {hotel?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-stone-900">
                      {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {booking.booking_status}
                    </span>
                  </div>
                </div>
              );
            })}
            {upcomingCheckIns.length === 0 && (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">No upcoming check-ins</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
