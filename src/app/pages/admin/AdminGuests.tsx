import { useState } from 'react';
import { Loader2, Search, Filter, Mail, Phone, Trash2, UserX, UserCheck, Shield, UserPlus, Star, Edit2, Check } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { adminService } from '../../lib/api';
import { toast } from 'sonner';

export function AdminGuests() {
  const { guests, isLoading, refreshData } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [editingGuestId, setEditingGuestId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBan = async (id: number, currentStatus: string) => {
    const action = currentStatus === 'banned' ? 'UNBAN' : 'BAN';
    if (!window.confirm(`Are you sure you want to ${action} this guest? ${action === 'BAN' ? 'All future bookings will be cancelled.' : ''}`)) return;
    
    setIsProcessing(id);
    try {
      const res = await adminService.banGuest(id);
      if (res.success) {
        toast.success(res.message || 'Guest status updated');
        await refreshData();
      } else {
        toast.error(res.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Are you sure you want to REMOVE this guest record? This cannot be undone.')) return;
    
    setIsProcessing(id);
    try {
      const res = await adminService.removeGuest(id);
      if (res.success) {
        toast.success('Guest record removed successfully');
        await refreshData();
      } else {
        toast.error(res.error || 'Failed to remove guest');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEditClick = (guest: any) => {
    setEditingGuestId(guest.id);
    setEditFormData({
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
    });
  };

  const handleCloseEdit = () => {
    setEditingGuestId(null);
    setEditFormData(null);
  };

  const handleSaveGuest = async () => {
    if (!editFormData || !editingGuestId) return;

    setIsSubmitting(true);
    try {
      const result = await adminService.updateGuest(editingGuestId, editFormData);
      if (result.success) {
        toast.success('Guest profile updated successfully');
        await refreshData();
        handleCloseEdit();
      } else {
        toast.error(result.error || 'Failed to update guest');
      }
    } catch (error) {
      toast.error('Error updating guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Synchronizing Guest Data...</p>
      </div>
    );
  }

  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.first_name} ${guest.last_name}`.toLowerCase();
    const email = (guest.email || '').toLowerCase();
    const displayId = (guest.display_id || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          email.includes(searchTerm.toLowerCase()) ||
                          displayId.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Guest Relations</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Manage guest profiles, loyalty and access</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm px-5 py-2 font-bold transition-all active:scale-95">
             <UserPlus className="w-4 h-4 mr-2" />
             Register New Guest
          </Button>
        </div>
      </div>

      <div className="fade-up bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4" style={{ animationDelay: '100ms' }}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search by name, email, or guest loyalty ID..." 
              className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Members</SelectItem>
              <SelectItem value="banned">Banned Accounts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="fade-up bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '150ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-medium">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Guest Member</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Loyalty ID</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Contact Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((guest) => {
                const isBanned = guest.status === 'banned';
                return (
                  <tr key={guest.id} className={`group hover:bg-slate-50/70 transition-all ${isBanned ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:scale-105 ${isBanned ? 'bg-slate-400' : 'bg-blue-600'}`}>
                          {guest.first_name?.charAt(0)}{guest.last_name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold tracking-tight ${isBanned ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {guest.first_name} {guest.last_name}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                             <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Standard Tier</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[11px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {guest.display_id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {guest.email}
                        </div>
                        {guest.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Phone className="w-3 h-3 text-slate-300" />
                            {guest.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isBanned ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                          <div className="w-1 h-1 rounded-full bg-red-600" />
                          <span className="text-[10px] font-black uppercase">Restricted</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                          <span className="text-[10px] font-black uppercase">Active Member</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleEditClick(guest)}
                          className="p-2 rounded bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                          title="Edit Guest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleBan(guest.id, guest.status || 'active')}
                          disabled={isProcessing === guest.id}
                          className={`p-2 rounded border transition-all ${
                            isBanned 
                              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-red-500 hover:text-red-600 shadow-sm'
                          }`}
                          title={isBanned ? 'Lift Restriction' : 'Restrict Account'}
                        >
                          {isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRemove(guest.id)}
                          disabled={isProcessing === guest.id}
                          className="p-2 rounded bg-white text-slate-600 border border-slate-200 hover:border-red-500 hover:text-red-600 transition-all shadow-sm"
                          title="Purge Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredGuests.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                 <Shield className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No guest profiles found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Guest Modal */}
      <Dialog open={editingGuestId !== null} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
        <DialogContent className="bg-white border-slate-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-950">Edit Guest Profile</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <Input
                    value={editFormData.first_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    className="bg-slate-50 border-slate-200"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <Input
                    value={editFormData.last_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    className="bg-slate-50 border-slate-200"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <Input
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Enter email"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <Input
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Enter phone number"
                  type="tel"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGuest}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
