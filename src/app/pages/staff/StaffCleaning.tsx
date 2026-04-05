import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, Clock, Wind, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export function StaffCleaning() {
  const { rooms, staff, cleaningAssignments, completeCleaningTask, isLoading, refreshData } = useBooking();

  const [taskFilter, setTaskFilter] = useState<'all' | 'cleaning' | 'maintenance'>('all');
  const [staffFilter, setStaffFilter] = useState<'all' | 'housekeeping' | 'maintenance' | 'available' | 'busy'>('all');

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Cleaning System...</p>
      </div>
    );
  }


  const cleaningAndMaintenanceStaff = staff.filter(s => {
    const r = (s.role || (s as any).position || '').toLowerCase();
    return r === 'housekeeping' || r === 'cleaner' || r === 'maintenance';
  });

  const activeAssignments = cleaningAssignments.filter(ca => ca.status !== 'completed');

  const getStaffStatus = (staffId: number) => {
    const assignment = activeAssignments.find(ca => ca.staff_id === staffId);
    if (assignment) {
      const room = rooms.find(r => r.room_id === assignment.room_id);
      return { status: 'Busy', room: `Room ${room?.room_number}`, color: 'bg-amber-100 text-amber-700' };
    }
    return { status: 'Available', room: '—', color: 'bg-emerald-100 text-emerald-700' };
  };

  const handleComplete = async (roomId: number) => {
    try {
      await completeCleaningTask(roomId);
      toast.success('Room cleaning completed!');
    } catch {
      toast.error('Failed to complete cleaning task');
    }
  };

  const filteredAssignments = activeAssignments.filter(ca => {
    if (taskFilter === 'all') return true;
    const assignedStaff = staff.find(s => s.id === ca.staff_id);
    const staffRole = (assignedStaff?.role || (assignedStaff as any)?.position || '').toLowerCase();
    const isMaintenance = staffRole === 'maintenance';
    if (taskFilter === 'maintenance') return isMaintenance;
    if (taskFilter === 'cleaning') return !isMaintenance;
    return true;
  });

  const filteredStaff = cleaningAndMaintenanceStaff.filter(s => {
    if (staffFilter === 'all') return true;
    const status = getStaffStatus(s.id);
    const r = (s.role || (s as any).position || '').toLowerCase();
    
    if (staffFilter === 'maintenance') return r === 'maintenance';
    if (staffFilter === 'housekeeping') return r === 'housekeeping' || r === 'cleaner';
    if (staffFilter === 'available') return status.status === 'Available';
    if (staffFilter === 'busy') return status.status === 'Busy';
    return true;
  });

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Sparkles className="text-teal-500 w-8 h-8" />
            Cleaning & Staff
          </h1>
          <p className="text-slate-500 mt-1">Room sanitization and staff assignments</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-bold">{activeAssignments.length} Active</span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">{cleaningAndMaintenanceStaff.length} Staff</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ animationDelay: '80ms' }}>
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Active Assignments ({filteredAssignments.length})
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['all', 'cleaning', 'maintenance'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                    taskFilter === filter ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="fade-up bg-white rounded-xl border-2 border-dashed border-slate-200 px-6 py-16 text-center text-slate-400" style={{ animationDelay: '160ms' }}>
              <Wind className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No active cleaning tasks</p>
              <p className="text-sm mt-1">Everything is sparkling clean!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredAssignments.map((ca, index) => {
                const room = rooms.find(r => r.room_id === ca.room_id);
                const assignedStaff = staff.find(s => s.id === ca.staff_id);
                const staffRole = (assignedStaff?.role || (assignedStaff as any)?.position || '').toLowerCase();
                const isMaintenance = staffRole === 'maintenance';
                return (
                  <div key={`${ca.room_id}-${ca.staff_id}`} className="fade-up bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all" style={{ animationDelay: `${160 + index * 80}ms` }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-sm font-bold">
                          Room {room?.room_number}
                        </span>
                        <p className="text-xs text-slate-400 mt-2">Floor {room?.floor}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-bold animate-pulse">
                        {ca.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-lg">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {assignedStaff?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{assignedStaff?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-400">Assigned {new Date(ca.assigned_at).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <Button onClick={() => handleComplete(ca.room_id)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-teal-200 transition-all active:scale-[0.98]">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {isMaintenance ? 'MARK AS DONE' : 'MARK AS CLEANED'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Staff Roster */}
        <div className="fade-up space-y-4" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              Operations Staff Roster
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setStaffFilter('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'all' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >All Staff</button>
              <button
                onClick={() => setStaffFilter('housekeeping')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'housekeeping' ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Housekeeping</button>
              <button
                onClick={() => setStaffFilter('maintenance')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'maintenance' ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Maintenance</button>
              <button
                onClick={() => setStaffFilter('busy')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'busy' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Busy</button>
              <button
                onClick={() => setStaffFilter('available')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'available' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Available</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {filteredStaff.map((s) => {
              const status = getStaffStatus(s.id);
              return (
                <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {s.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{s.name ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{status.room}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
                    {status.status}
                  </span>
                </div>
              );
            })}
            {filteredStaff.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No operations staff found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
