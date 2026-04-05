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
        <p className="mt-6 text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Operations...</p>
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
    { title: 'Occupied Rooms', value: occupiedRooms, icon: Clock, gradient: 'from-amber-500 to-amber-600' },
    { title: 'Active Cleaning', value: activeCleaning, icon: Sparkles, gradient: 'from-teal-500 to-teal-600' },
  ];

  const upcomingCheckIns = bookings
    .filter(b => b.booking_status === 'confirmed' || b.booking_status === 'pending')
    .sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Welcome Header */}
      <div className="fade-up bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Operations Dashboard</h1>
        <p className="text-slate-300 mt-2 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' • '}{activeBookings} active bookings • {rooms.length} total rooms
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="fade-up bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"
              style={{ animationDelay: `${100 + index * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Room Status Overview + Upcoming Check-ins */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Status */}
        <div className="fade-up bg-white rounded-xl border border-slate-200 p-6" style={{ animationDelay: '400ms' }}>
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-slate-400" />
            Room Overview
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Available</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rooms.length > 0 ? (availableRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-bold text-slate-900 w-8 text-right">{availableRooms}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Occupied</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-bold text-slate-900 w-8 text-right">{occupiedRooms}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Maintenance</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rooms.length > 0 ? (maintenanceRooms / rooms.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-sm font-bold text-slate-900 w-8 text-right">{maintenanceRooms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Check-ins */}
        <div className="fade-up lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ animationDelay: '500ms' }}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Upcoming Check-ins
            </h2>
            <span className="text-xs text-slate-400 font-medium">{upcomingCheckIns.length} pending</span>
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
                      <p className="text-sm font-semibold text-slate-900">{guest?.first_name} {guest?.last_name}</p>
                      <p className="text-xs text-slate-400">{booking.booking_reference} • {hotel?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
