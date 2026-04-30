import { useState } from 'react';
import { Loader2, Search, Trash2, Edit2, Check, Unlock, Lock, X, UserPlus, Users, Mail } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { adminService } from '../../lib/api';
import { toast } from 'sonner';

export function AdminGuests() {
  const { guests, isLoading, refreshData } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div className="h-[70vh] flex flex-col items-center justify-center text-slate-900 font-medium"> <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-4" /> Syncing Guest Data...</div>;

  const handleAction = async (id: number, api: any, msg: string) => {
    setIsProcessing(id);
    const res = await api(id);
    if (res.success) { toast.success(msg); refreshData(); } else toast.error(res.error || 'Failed');
    setIsProcessing(null);
  };

  const filtered = guests.filter(g => 
    (!searchTerm || `${g.first_name} ${g.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || g.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || (statusFilter === 'active' && g.status !== 'banned') || (statusFilter === 'banned' && g.status === 'banned'))
  );

  return (
    <div className="space-y-8 p-4 md:p-8 -m-4 md:-m-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">Directory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Guest Management</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">{guests.length} total profiles registered</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-4 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 h-14 bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-14 border-slate-100 bg-slate-50 text-sm font-bold w-full md:w-[220px] rounded-[1.5rem] px-5 outline-none focus:ring-2 focus:ring-slate-900/10">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent className="z-[200] bg-white rounded-[1.5rem] border-slate-100 shadow-xl overflow-hidden p-1">
            <SelectItem value="all" className="font-bold rounded-xl focus:bg-slate-100 cursor-pointer py-3">All States</SelectItem>
            <SelectItem value="active" className="font-bold rounded-xl focus:bg-slate-100 cursor-pointer py-3 text-emerald-600">Active Only</SelectItem>
            <SelectItem value="banned" className="font-bold rounded-xl focus:bg-slate-100 cursor-pointer py-3 text-rose-600">Restricted Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5 rounded-tl-2xl">Guest Identity</th>
              <th className="px-6 py-5">Contact Details</th>
              <th className="px-6 py-5">Account Status</th>
              <th className="px-6 py-5 text-right rounded-tr-2xl">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(g => {
            const isBanned = g.status === 'banned';
            return (
              <tr key={g.id} className="group hover:bg-slate-50/80 transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-white text-lg font-black shadow-sm ${isBanned ? 'bg-rose-500 shadow-rose-500/20' : 'bg-slate-900 shadow-slate-900/20'}`}>
                      {g.first_name[0].toUpperCase()}
                    </div>
                    <div>
                      <span className={`block text-base font-black ${isBanned ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{g.first_name} {g.last_name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{g.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />{g.email}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isBanned ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                    {isBanned ? 'Restricted' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button disabled={isProcessing === g.id} onClick={() => handleAction(g.id, adminService.banGuest, 'Access updated')} className={`p-2.5 rounded-xl transition-colors ${isBanned ? 'bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}>
                      {isBanned ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setEditingGuest(g)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button disabled={isProcessing === g.id} onClick={() => { if (confirm(`Purge profile ${g.first_name}?`)) handleAction(g.id, adminService.removeGuest, 'Guest removed') }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold">No profiles found</p>
            <p className="text-sm text-slate-400 font-medium mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingGuest} onOpenChange={o => { if (!o) setEditingGuest(null); }}>
        <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] p-0 overflow-hidden shadow-2xl border-none animate-dialog-popup">
          <div className="bg-slate-900 p-8 relative overflow-hidden flex justify-between items-center text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px]" />
            <div className="relative z-10">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-2 inline-block">Profile Editor</span>
              <h3 className="text-2xl font-black tracking-tight">Edit Identity</h3>
            </div>
            <button onClick={() => setEditingGuest(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors relative z-10"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                <input value={editingGuest?.first_name || ''} onChange={e => setEditingGuest({...editingGuest, first_name: e.target.value})} className="h-12 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-2xl px-4 w-full font-bold text-sm outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                <input value={editingGuest?.last_name || ''} onChange={e => setEditingGuest({...editingGuest, last_name: e.target.value})} className="h-12 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-2xl px-4 w-full font-bold text-sm outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <input value={editingGuest?.email || ''} onChange={e => setEditingGuest({...editingGuest, email: e.target.value})} className="h-12 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-2xl px-4 w-full font-bold text-sm outline-none transition-colors" />
            </div>
            <div className="pt-4 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditingGuest(null)} className="rounded-2xl px-6 h-12 font-bold hover:bg-slate-50">Cancel</Button>
              <Button onClick={async () => {
                setIsSubmitting(true);
                const res = await adminService.updateGuest(editingGuest.id, editingGuest);
                if (res.success) { toast.success('Profile updated'); refreshData(); setEditingGuest(null); } else toast.error(res.error || 'Failed');
                setIsSubmitting(false);
              }} disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 font-bold h-12 shadow-xl shadow-slate-900/20">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 mr-2" />} Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
