import { Loader2, DollarSign, Building2, Layers, Users, ArrowUpRight } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function AdminRates() {
  const { roomTypes, hotels, isLoading } = useBooking();

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-black text-slate-400 tracking-widest uppercase animate-pulse">Analyzing Market Rates...</p>
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
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rate Management</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Configure property pricing and room type distribution</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <DollarSign className="w-3.5 h-3.5" />
           {roomTypes.length} Active Rate Plans
        </div>
      </div>

      <div className="space-y-8">
        {hotelGroups.map(({ hotel, types }, index) => (
          <div key={hotel.id} className="fade-up space-y-3" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="flex items-center gap-3 px-1">
               <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                  <Building2 className="w-4 h-4" />
               </div>
               <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{hotel.name}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{hotel.city} <span className="mx-1">•</span> {types.length} inventory types</p>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-medium">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Inventory Type</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Bed Layout</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Capacity</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Standard Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {types.map(rt => (
                      <tr key={rt.room_type_id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-950 tracking-tight">{rt.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 truncate max-w-xs">{rt.description || 'No description provided'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">
                             <Layers className="w-3 h-3 text-slate-400" />
                             <span className="text-[10px] font-bold uppercase tracking-tight">{rt.bed_type || 'STND'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                              <Users className="w-3.5 h-3.5 text-slate-300" />
                              {rt.max_occupancy}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1.5 font-black text-slate-900">
                                 <span className="text-xs">₱</span>
                                 <span className="text-lg tracking-tighter">{Number(rt.base_price).toLocaleString()}</span>
                                 <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-black" />
                              </div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate / Night</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        
        {hotelGroups.length === 0 && (
          <div className="py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-slate-100" />
             </div>
             <h3 className="text-sm font-bold text-slate-900">Pricing data unavailable</h3>
             <p className="text-xs text-slate-500 mt-1">Configure room types and properties to begin rate management.</p>
          </div>
        )}
      </div>
    </div>
  );
}
