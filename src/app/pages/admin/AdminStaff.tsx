import { useState } from 'react';
import { Loader2, Mail, Phone, Building2, Shield, Search, Filter } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function AdminStaff() {
  const { staff, hotels, isLoading } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Staff...</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('manager')) return 'bg-indigo-100 text-indigo-700';
    if (r.includes('front') || r.includes('receptionist')) return 'bg-emerald-100 text-emerald-700';
    if (r.includes('housekeep') || r.includes('clean')) return 'bg-amber-100 text-amber-700';
    if (r.includes('concierge')) return 'bg-violet-100 text-violet-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500 mt-1">{staff.length} staff members across all properties</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {staff.length} Members
        </div>
      </div>

      {/* Filters */}
      <div className="fade-up grid md:grid-cols-3 gap-4" style={{ animationDelay: '100ms' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search staff by name or email..." 
            className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-white border-slate-200">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="receptionist">Receptionist</SelectItem>
            <SelectItem value="housekeeping">Housekeeping</SelectItem>
          </SelectContent>
        </Select>
        <Select value={hotelFilter} onValueChange={setHotelFilter}>
          <SelectTrigger className="bg-white border-slate-200">
            <Building2 className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Filter by Hotel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hotels</SelectItem>
            {hotels.map(h => (
              <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '150ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Member</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.filter(member => {
                const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      member.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = roleFilter === 'all' || member.role === roleFilter;
                const matchesHotel = hotelFilter === 'all' || member.hotel_id.toString() === hotelFilter;
                return matchesSearch && matchesRole && matchesHotel;
              }).map((member) => {
                const hotel = hotels.find(h => h.id === member.hotel_id);
                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {member.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.display_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {hotel?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {staff.length === 0 && (
            <div className="px-6 py-16 text-center text-slate-400">
              <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No staff members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
