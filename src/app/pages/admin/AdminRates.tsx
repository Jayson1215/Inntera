import { useState } from 'react';
import { Loader2, DollarSign, Building2, Users, ArrowUpRight, Pencil, X, Save } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function AdminRates() {
  const { roomTypes, hotels, isLoading, updateRoomType } = useBooking();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', bed_type: 'Single', max_occupancy: 2, base_price: 0 });
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 font-medium"><Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" /> Analyzing Market Rates...</div>;

  const handleEdit = (rt: any) => { setEditing(rt); setForm({ name: rt.name, bed_type: rt.bed_type || 'Single', max_occupancy: rt.max_occupancy || 2, base_price: rt.base_price || 0 }); };
  const handleSave = async () => { setIsSaving(true); try { await updateRoomType(editing.room_type_id, form); setEditing(null); } finally { setIsSaving(false); } };

  const groups = hotels.map(h => ({ h, types: roomTypes.filter(rt => rt.hotel_id === h.id) })).filter(g => g.types.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900">Rate Management</h1><p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Property pricing and inventory configuration</p></div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> {roomTypes.length} Active Rates</div>
      </div>

      <div className="space-y-8">{groups.map(({ h, types }) => (
        <div key={h.id} className="space-y-3">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Building2 className="w-4 h-4" /></div><div><h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{h.name}</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.city}</p></div></div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto"><table className="w-full text-left font-medium">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest"><tr><th className="px-6 py-4">Inventory Type</th><th className="px-6 py-4 text-center">Beds</th><th className="px-6 py-4 text-center">Capacity</th><th className="px-6 py-4 text-right">Standard Rate</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{types.map(rt => (
              <tr key={rt.room_type_id} className="group hover:bg-slate-50/50 transition-all"><td className="px-6 py-4"><div><p className="text-sm font-black text-slate-900">{rt.name}</p><p className="text-[10px] text-slate-400 truncate max-w-xs">{rt.description || 'No description'}</p></div></td>
                <td className="px-6 py-4 text-center text-[10px] font-black uppercase text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded-md">{rt.bed_type || 'STND'}</span></td>
                <td className="px-6 py-4 text-center text-xs font-black"><div className="flex items-center justify-center gap-2"><Users className="w-3.5 h-3.5 text-slate-400" />{rt.max_occupancy}</div></td>
                <td className="px-6 py-4 text-right font-black text-slate-900"><div className="flex flex-col items-end"><div className="flex items-center gap-1">₱<span className="text-lg">{Number(rt.base_price).toLocaleString()}</span><ArrowUpRight className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover:opacity-100" /></div><span className="text-[8px] text-slate-400">PER NIGHT</span></div></td>
                <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" onClick={() => handleEdit(rt)} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"><Pencil className="w-3.5 h-3.5" /></Button></td></tr>))}</tbody></table></div></div>))}
      </div>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50"><div><h3 className="font-bold text-slate-900">Edit Rate Plan</h3><p className="text-[10px] text-slate-400 font-bold uppercase">{editing.name}</p></div><button onClick={() => setEditing(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button></div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase text-slate-400">Inventory Type</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="h-11 font-bold" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase text-slate-400">Bed Layout</Label><select value={form.bed_type} onChange={e => setForm({...form, bed_type: e.target.value})} className="flex h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold"><option value="Single">Single</option><option value="Double">Double</option></select></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-bold uppercase text-slate-400">Capacity</Label><Input type="number" value={form.max_occupancy} onChange={e => setForm({...form, max_occupancy: parseInt(e.target.value) || 1})} className="h-11 font-bold" /></div>
            </div>
            <div className="space-y-1.5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100"><Label className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Standard Rate</Label><div className="relative"><span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span><Input type="number" value={form.base_price} onChange={e => setForm({...form, base_price: parseFloat(e.target.value) || 0})} className="pl-6 h-12 bg-transparent border-none text-xl font-black text-slate-900 focus:ring-0" /></div></div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t flex gap-3 justify-end"><Button variant="ghost" onClick={() => setEditing(null)} className="font-bold text-xs">Cancel</Button><Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white px-6 font-bold text-xs">{isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes</Button></div>
        </div></div>}
    </div>
  );
}
