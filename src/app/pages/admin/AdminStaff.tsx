import { useState } from 'react';
import { Loader2, Search, Trash2, UserPlus, Edit2, X, Lock, Unlock, Users } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { adminService } from '../../lib/api';
import { toast } from 'sonner';

const STYLES: any = {
  maintenance: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  manager: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  receptionist: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
};

export function AdminStaff() {
  const { staff, hotels, isLoading, refreshData, addStaff } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123', position: 'receptionist', hotel_id: '' });

  if (isLoading) return <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-900 font-medium"> <Loader2 className="animate-spin text-violet-500 w-10 h-10" /> Loading team...</div>;

  const handleAction = async (id: number, api: any, msg: string) => {
    setIsProcessing(id);
    const res = await api(id);
    if (res.success) { toast.success(msg); refreshData(); } else toast.error(res.error || 'Failed');
    setIsProcessing(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = editingStaff ? await adminService.updateStaff(editingStaff.id, editingStaff) : await addStaff({ ...formData, hotel_id: parseInt(formData.hotel_id || '0'), role: formData.position });
    if (res.success) { toast.success(editingStaff ? 'Staff updated' : 'Staff added'); setIsAdding(false); setEditingStaff(null); setFormData({ name: '', email: '', password: 'password123', position: 'receptionist', hotel_id: '' }); } else toast.error(res.error || 'Failed');
    setIsSubmitting(false);
  };

  const filtered = staff.filter(s => 
    (!searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())) && 
    (roleFilter === 'all' || s.role === roleFilter) &&
    (hotelFilter === 'all' || s.hotel_id?.toString() === hotelFilter)
  );

  return (
    <div className="space-y-6 p-4 md:p-8 -m-4 md:-m-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900">Staff Management</h1><p className="text-sm text-slate-900">{staff.length} members across {hotels.length} properties</p></div>
        <Button onClick={() => { setEditingStaff(null); setIsAdding(true); }} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6"><UserPlus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['maintenance', 'manager', 'receptionist'].map(role => (
          <div key={role} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${STYLES[role].bg}`}><Users className={`w-5 h-5 ${STYLES[role].text}`} /></div>
            <div><p className="text-2xl font-bold text-slate-900">{staff.filter(s => s.role === role).length}</p><p className="text-xs text-slate-900 font-medium capitalize">{role}s</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-3 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 w-4 h-4" /><input placeholder="Search name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 h-11 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500/20" /></div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="h-11 border-slate-100 bg-slate-50 text-sm w-[140px] rounded-xl"><SelectValue placeholder="All Roles" /></SelectTrigger><SelectContent className="z-[200] bg-white rounded-xl border-slate-100 shadow-lg"><SelectItem value="all">All Roles</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="receptionist">Receptionist</SelectItem><SelectItem value="manager">Manager</SelectItem></SelectContent></Select>
          <Select value={hotelFilter} onValueChange={setHotelFilter}><SelectTrigger className="h-11 border-slate-100 bg-slate-50 text-sm w-[180px] rounded-xl"><SelectValue placeholder="All Properties" /></SelectTrigger><SelectContent className="z-[200] bg-white rounded-xl border-slate-100 shadow-lg"><SelectItem value="all">All Properties</SelectItem>{hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-900 uppercase tracking-wider"><tr><th className="px-6 py-4">Member</th><th className="px-6 py-4 hidden md:table-cell">Property</th><th className="px-6 py-4 hidden sm:table-cell">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-50">{filtered.map(s => {
            const style = STYLES[s.role] || { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
            const isSuspended = s.status === 'suspended';
            return <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${isSuspended ? 'bg-slate-300' : 'bg-violet-600'}`}>{s.name[0].toUpperCase()}</div><div><p className={`text-sm font-semibold ${isSuspended ? 'text-slate-900 line-through' : 'text-slate-900'}`}>{s.name}</p><p className="text-xs text-slate-900">{s.user?.email || '—'}</p></div></div></td><td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600 font-medium">{hotels.find(h => h.id === s.hotel_id)?.name || 'Unassigned'}</td><td className="px-6 py-4 hidden sm:table-cell"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}><span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />{s.role[0].toUpperCase() + s.role.slice(1)}</span></td><td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isSuspended ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}><span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />{isSuspended ? 'Suspended' : 'Active'}</span></td><td className="px-6 py-4 text-right flex justify-end gap-1"><button disabled={isProcessing === s.id} onClick={() => handleAction(s.id, adminService.suspendStaff, 'Status updated')} className="p-2 rounded-lg text-slate-900 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-50">{isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}</button><button onClick={() => setEditingStaff(s)} className="p-2 rounded-lg text-slate-900 hover:text-violet-600 hover:bg-violet-50"><Edit2 className="w-4 h-4" /></button><button disabled={isProcessing === s.id} onClick={() => { if (confirm(`Remove ${s.name}?`)) handleAction(s.id, adminService.removeStaff, 'Staff removed') }} className="p-2 rounded-lg text-slate-900 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button></td></tr>;
          })}</tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-16"><Users className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-900 font-medium">No results found</p></div>}
      </div>

      <Dialog open={isAdding || (editingStaff !== null)} onOpenChange={o => { if (!o) { setIsAdding(false); setEditingStaff(null); } }}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-0 overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-900">{editingStaff ? 'Edit Staff' : 'Add Staff'}</h3><p className="text-xs text-slate-900">Team member details and property access</p></div><button onClick={() => { setIsAdding(false); setEditingStaff(null); }} className="p-2 rounded-lg text-slate-900 hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600">Full Name</label><input value={editingStaff ? editingStaff.name : formData.name} onChange={e => editingStaff ? setEditingStaff({ ...editingStaff, name: e.target.value }) : setFormData({ ...formData, name: e.target.value })} className="h-11 bg-white border border-slate-200 rounded-xl px-4 w-full text-sm outline-none focus:ring-2 focus:ring-violet-500/20" /></div>
            {!editingStaff && <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600">Email</label><input placeholder="jane@hotel.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-11 border border-slate-200 rounded-xl px-4 w-full text-sm" /></div><div className="space-y-1.5"><label className="text-xs font-semibold text-slate-600">Password</label><input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="h-11 border border-slate-200 rounded-xl px-4 w-full text-sm" /></div></div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Property</label>
                <Select value={editingStaff ? editingStaff.hotel_id?.toString() : formData.hotel_id} onValueChange={v => editingStaff ? setEditingStaff({ ...editingStaff, hotel_id: parseInt(v) }) : setFormData({ ...formData, hotel_id: v })}>
                  <SelectTrigger className="h-11 border border-slate-200 rounded-xl text-sm"><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent className="z-[201] bg-white rounded-xl">{hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Role</label>
                <Select value={editingStaff ? editingStaff.role : formData.position} onValueChange={v => editingStaff ? setEditingStaff({ ...editingStaff, role: v }) : setFormData({ ...formData, position: v })}>
                  <SelectTrigger className="h-11 border border-slate-200 rounded-xl text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[201] bg-white rounded-xl">
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3"><Button variant="ghost" onClick={() => { setIsAdding(false); setEditingStaff(null); }} className="rounded-xl px-5">Cancel</Button><Button onClick={handleSubmit} disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingStaff ? 'Save Changes' : 'Add Member'}</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
