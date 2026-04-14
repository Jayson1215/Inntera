import { useState } from 'react';
import { Loader2, Mail, Building2, Shield, Search, Filter, Trash2, UserX, UserCheck, UserPlus, Edit2, X, Check } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { adminService } from '../../lib/api';
import { toast } from 'sonner';

export function AdminStaff() {
  const { staff, hotels, isLoading, refreshData } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuspend = async (id: number, currentStatus: string) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'suspended' ? 'ACTIVATE' : 'SUSPEND'} this staff member?`)) return;
    
    setIsProcessing(id);
    try {
      const res = await adminService.suspendStaff(id);
      if (res.success) {
        toast.success(res.message || 'Status updated');
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
    if (!window.confirm('Are you sure you want to REMOVE this staff member?')) return;
    
    setIsProcessing(id);
    try {
      const res = await adminService.removeStaff(id);
      if (res.success) {
        toast.success('Staff member removed successfully');
        await refreshData();
      } else {
        toast.error(res.error || 'Failed to remove staff');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEditClick = (member: any) => {
    setEditingStaffId(member.id);
    setEditFormData({
      name: member.name,
      email: member.user?.email,
      position: member.role,
      hotel_id: member.hotel_id,
    });
  };

  const handleCloseEdit = () => {
    setEditingStaffId(null);
    setEditFormData(null);
  };

  const handleSaveStaff = async () => {
    if (!editFormData || !editingStaffId) return;

    setIsSubmitting(true);
    try {
      const result = await adminService.updateStaff(editingStaffId, editFormData);
      if (result.success) {
        toast.success('Staff updated successfully');
        await refreshData();
        handleCloseEdit();
      } else {
        toast.error(result.error || 'Failed to update staff');
      }
    } catch (error) {
      toast.error('Error updating staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Staff...</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('manager')) return 'bg-indigo-100 text-indigo-700';
    if (r.includes('front') || r.includes('receptionist')) return 'bg-emerald-100 text-emerald-700';
    if (r.includes('housekeep') || r.includes('clean')) return 'bg-amber-100 text-amber-700';
    if (r.includes('concierge')) return 'bg-violet-100 text-violet-700';
    return 'bg-slate-100 text-slate-700';
  };

  const filteredStaff = staff.filter(member => {
    const name = (member.name || '').toLowerCase();
    const email = (member.user?.email || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          email.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesHotel = hotelFilter === 'all' || member.hotel_id.toString() === hotelFilter;
    return matchesSearch && matchesRole && matchesHotel;
  });

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Manage your property personnel and access levels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm px-5 py-2 font-bold transition-all active:scale-95">
             <UserPlus className="w-4 h-4 mr-2" />
             Add New Staff
          </Button>
        </div>
      </div>

      <div className="fade-up bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4" style={{ animationDelay: '100ms' }}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search by name, email or staff ID..." 
              className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="All Roles" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="manager">Managers</SelectItem>
              <SelectItem value="receptionist">Receptionists</SelectItem>
              <SelectItem value="housekeeping">Housekeeping</SelectItem>
            </SelectContent>
          </Select>
          <Select value={hotelFilter} onValueChange={setHotelFilter}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="All Properties" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {hotels.map(h => (
                <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="fade-up bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '150ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center w-16">#</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Full Name / ID</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Department & Role</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Account Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Property Association</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member, idx) => {
                const hotel = hotels.find(h => h.id === member.hotel_id);
                const isSuspended = (member as any).status === 'suspended';
                return (
                  <tr key={member.id} className={`group hover:bg-slate-50/70 transition-all ${isSuspended ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm ${isSuspended ? 'bg-slate-400' : 'bg-blue-600'}`}>
                          {member.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold tracking-tight ${isSuspended ? 'text-slate-400 line-through' : 'text-slate-950'}`}>{member.name}</span>
                          <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">{member.display_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                         <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getRoleColor(member.role)}`}>
                            {member.role}
                         </span>
                         <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <Mail className="w-3 h-3 text-slate-300" />
                            {member.user?.email || 'N/A'}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isSuspended ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                          <div className="w-1 h-1 rounded-full bg-red-600" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Suspended</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Active</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-300" />
                        {hotel?.name || 'Main Hub'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleEditClick(member)}
                          className="p-1.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                          title="Edit Staff"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSuspend(member.id, (member as any).status || 'active')}
                          disabled={isProcessing === member.id}
                          className={`p-1.5 rounded border transition-all ${
                            isSuspended 
                              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600'
                          }`}
                          title={isSuspended ? 'Activate Access' : 'Suspend Access'}
                        >
                          {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRemove(member.id)}
                          disabled={isProcessing === member.id}
                          className="p-1.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-red-500 hover:text-red-600 transition-all"
                          title="Remove Record"
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
          {filteredStaff.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                 <Shield className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No personnel found</h3>
              <p className="text-xs text-slate-500 mt-1">Adjust your filters or add a new staff member.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      <Dialog open={editingStaffId !== null} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
        <DialogContent className="bg-white border-slate-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-950">Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <Input
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                  placeholder="Enter staff name"
                />
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
                <Select value={editFormData.position || ''} onValueChange={(value) => setEditFormData({ ...editFormData, position: value })}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property</label>
                <Select value={editFormData.hotel_id?.toString() || ''} onValueChange={(value) => setEditFormData({ ...editFormData, hotel_id: parseInt(value) })}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(h => (
                      <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStaff}
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
