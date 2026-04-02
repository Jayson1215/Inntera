import { useState } from 'react';
import { Mail, Phone, Loader2, Search, Users } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Guest, Booking } from '../../types';

export function AdminGuests() {
  const { guests, bookings, isLoading } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Guests...</p>
      </div>
    );
  }

  const guestsWithBookings = guests.map((guest: Guest) => ({
    ...guest,
    bookingCount: bookings.filter((b: Booking) => b.guest_id === guest.id).length,
    activeBooking: bookings.find((b: Booking) => b.guest_id === guest.id && (b.booking_status === 'confirmed' || b.booking_status === 'checked-in')),
  }));

  const filteredGuests = guestsWithBookings.filter(g => {
    const name = `${g.first_name} ${g.last_name}`.toLowerCase();
    return !searchTerm || name.includes(searchTerm.toLowerCase()) || g.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Guest Management</h1>
          <p className="text-slate-500 mt-1">{guests.length} registered guests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center gap-2">
            <Users className="w-4 h-4" />
            {guests.length} Total
          </div>
        </div>
      </div>

      <div className="fade-up relative" style={{ animationDelay: '100ms' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Loyalty</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Bookings</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {guest.first_name?.charAt(0)}{guest.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{guest.first_name} {guest.last_name}</p>
                        <p className="text-xs text-slate-400">{guest.display_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {guest.email}
                      </div>
                      {guest.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {guest.loyalty_member_id ? (
                      <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">{guest.loyalty_member_id}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{guest.bookingCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    {guest.activeBooking ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(guest.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGuests.length === 0 && (
            <div className="px-6 py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No guests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
