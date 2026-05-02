import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, Loader2, Building2, Check, Search } from 'lucide-react';
import { Hotel } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { HotelCreateSchema, HotelUpdateSchema } from '../../validations';
import { toast } from 'sonner';

export function AdminHotels() {
  const { hotels, isLoading, addHotel, updateHotel, deleteHotel } = useBooking();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 font-medium"> <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" /> Synchronizing Portfolio...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      (editingHotel ? HotelUpdateSchema : HotelCreateSchema).parse(formData);
      setIsSubmitting(true);
      const res = editingHotel ? await updateHotel(editingHotel.id, formData) : await addHotel(formData);
      if (res.success) { toast.success('Portfolio updated'); setIsDialogOpen(false); setEditingHotel(null); setFormData({}); } else toast.error(res.error || 'Update failed');
    } catch (err: any) { toast.error(err.errors?.[0]?.message || 'Validation failed'); } finally { setIsSubmitting(false); }
  };

  const filtered = hotels.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 -m-4 md:-m-8 space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-4 border-emerald-500">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10"><h1 className="text-4xl font-black text-white tracking-tighter mb-2">Property Portfolio</h1><p className="text-slate-400 max-w-xl">Manage global assets and maintain operational standards across your network.</p></div>
        <Button onClick={() => { setEditingHotel(null); setFormData({}); setIsDialogOpen(true); }} className="relative z-10 group bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-black px-8 h-14 rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          <Plus className="mr-2 w-5 h-5 transition-transform duration-300 group-hover:rotate-90" /> Add Hotel
        </Button>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input placeholder="Search properties..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" /></div>
        <div className="px-6 h-14 rounded-2xl bg-slate-50 flex items-center gap-3 border border-slate-100"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets: {hotels.length}</span></div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <Table><TableHeader><TableRow className="bg-slate-900 border-none"><TableHead className="px-10 py-6 text-[10px] font-black text-white uppercase tracking-widest">Asset</TableHead><TableHead className="px-10 py-6 text-[10px] font-black text-white uppercase tracking-widest">Hotel Name</TableHead><TableHead className="px-10 py-6 text-[10px] font-black text-white uppercase tracking-widest">Location</TableHead><TableHead className="px-10 py-6 text-[10px] font-black text-white uppercase tracking-widest text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{filtered.map(h => (
            <TableRow key={h.id} className="group hover:bg-slate-50 transition-all"><TableCell className="px-10 py-6"><div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-lg transition-transform group-hover:scale-110">{h.image_url ? <img src={h.image_url} className="w-full h-full object-cover" /> : <Building2 className="w-full h-full p-4 text-slate-200" />}</div></TableCell>
              <TableCell className="px-10 py-6"><div className="font-black text-xl text-slate-900">{h.name}</div><div className="text-[10px] font-black text-emerald-500 uppercase mt-1">ID: {h.id}</div></TableCell><TableCell className="px-10 py-6 font-bold text-slate-600">{h.city}</TableCell>
              <TableCell className="px-10 py-6 text-right"><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => { setEditingHotel(h); setFormData(h); setIsDialogOpen(true); }} className="h-12 w-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800"><Edit className="w-4 h-4" /></Button><Button variant="ghost" onClick={async () => confirm('Decommission hotel?') && await deleteHotel(h.id)} className="h-12 w-12 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>))}
          </TableBody></Table>
        {filtered.length === 0 && <div className="py-24 text-center text-slate-400"><Building2 className="mx-auto w-12 h-12 mb-4 opacity-20" /><h3 className="text-xl font-black text-slate-900">No hotels found</h3></div>}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-0 overflow-hidden shadow-2xl border-none">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 flex justify-between items-center text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black">{editingHotel ? 'Edit Hotel' : 'Add Hotel'}</h3>
                <p className="text-emerald-100 text-xs font-bold mt-1 tracking-wide uppercase">
                  {editingHotel ? 'Update existing property details' : 'Register a new property to the portfolio'}
                </p>
              </div>
            </div>

          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hotel Name</Label>
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-14 bg-white border-2 border-black rounded-xl font-bold px-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Grand Plaza Hotel" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</Label>
                <Input value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} className="h-14 bg-white border-2 border-black rounded-xl font-bold px-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Metro Manila" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</Label>
                <Input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="h-14 bg-white border-2 border-black rounded-xl font-bold px-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" placeholder="+63 912 345 6789" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complete Address</Label>
              <Input value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="h-14 bg-white border-2 border-black rounded-xl font-bold px-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" placeholder="Full street address" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</Label>
              <Input value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="h-14 bg-white border-2 border-black rounded-xl font-bold px-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</Label>
              <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full h-32 bg-white border-2 border-black rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm resize-none" placeholder="Details about this property..." />
            </div>
            <div className="flex gap-4 justify-end pt-6 border-t border-slate-100">
              <Button type="button" onClick={() => setIsDialogOpen(false)} className="h-14 bg-slate-100 text-slate-600 font-bold rounded-xl px-8 hover:bg-slate-200 transition-colors">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl px-10 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check className="mr-2 w-5 h-5" />} Save Hotel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
