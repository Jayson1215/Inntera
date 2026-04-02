import { Loader2, DollarSign } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function AdminRates() {
  const { roomTypes, hotels, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Rates...</p>
      </div>
    );
  }

  // Group room types by hotel
  const hotelGroups = hotels.map(hotel => ({
    hotel,
    types: roomTypes.filter(rt => rt.hotel_id === hotel.id),
  })).filter(g => g.types.length > 0);

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rates & Pricing</h1>
          <p className="text-slate-500 mt-1">Room type pricing across all properties</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {roomTypes.length} Room Types
        </div>
      </div>

      <div className="space-y-6">
        {hotelGroups.map(({ hotel, types }, index) => (
          <div key={hotel.id} className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">{hotel.name}</h2>
                <p className="text-sm text-slate-400">{hotel.city} • {types.length} room types</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Type</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Type</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Max Occupancy</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Base Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {types.map(rt => (
                    <tr key={rt.room_type_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-slate-900">{rt.name}</p>
                        {rt.description && <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{rt.description}</p>}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{rt.bed_type || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{rt.max_occupancy} guests</td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-lg font-bold text-slate-900">₱{Number(rt.base_price).toLocaleString()}</span>
                        <span className="text-xs text-slate-400 ml-1">/night</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {hotelGroups.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center text-slate-400">
            <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No room types found</p>
          </div>
        )}
      </div>
    </div>
  );
}
