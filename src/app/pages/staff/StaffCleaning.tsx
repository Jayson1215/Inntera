import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, Clock, Wind, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export function StaffCleaning() {
  const { rooms, staff, cleaningAssignments, completeCleaningTask, isLoading, refreshData } = useBooking();

  const [taskFilter, setTaskFilter] = useState<'all' | 'cleaning' | 'maintenance'>('all');
  const [staffFilter, setStaffFilter] = useState<'all' | 'housekeeping' | 'maintenance' | 'available' | 'busy'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [staffFilter]);

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

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      {/* Operations Hero Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-emerald-900 to-stone-950 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/10 text-emerald-400">
                 <Sparkles className="w-8 h-8" />
              </div>
              Operations Command
            </h1>
            <p className="text-emerald-50/70 mt-3 text-sm lg:text-base font-medium max-w-lg">
              Live room sanitization, task tracking, and staff telemetry. Oversee the entire maintenance grid from one interface.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-emerald-100 font-bold text-sm flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
               {activeAssignments.length} Active Tasks
            </span>
            <span className="px-4 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-emerald-100 font-bold text-sm">
               {cleaningAndMaintenanceStaff.length} Total Staff
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Active Assignments */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
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
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-stone-200 px-6 py-16 text-center text-slate-400 shadow-sm">
              <Wind className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No active cleaning tasks</p>
              <p className="text-sm mt-1">Everything is sparkling clean!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssignments.map((ca, index) => {
                const room = rooms.find(r => r.room_id === ca.room_id);
                const assignedStaff = staff.find(s => s.id === ca.staff_id);
                const staffRole = (assignedStaff?.role || (assignedStaff as any)?.position || '').toLowerCase();
                const isMaintenance = staffRole === 'maintenance';
                return (
                  <div key={`${ca.room_id}-${ca.staff_id}`} className="bg-white rounded-[2rem] border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-sm font-bold">
                          Room {room?.room_number}
                        </span>
                        <p className="text-xs text-slate-400 mt-2">Floor {room?.floor}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold animate-pulse">
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
        <div className="space-y-6">
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
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'busy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Busy</button>
              <button
                onClick={() => setStaffFilter('available')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all border ${staffFilter === 'available' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >Available</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedStaff.map((s) => {
              const status = getStaffStatus(s.id);
              return (
                <div key={s.id} className="bg-white rounded-[2rem] border border-stone-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className={`absolute top-0 w-full h-1.5 ${status.status === 'Busy' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'bg-emerald-400'}`} />
                  <div className="w-16 h-16 mt-3 rounded-full bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 font-black text-xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {s.name?.charAt(0) || '?'}
                  </div>
                  <p className="text-sm font-black text-stone-900 leading-tight mb-1">{s.name ?? 'Unknown'}</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-4">{(s.role || (s as any).position || 'Staff').substring(0, 15)}</p>
                  <div className="mt-auto w-full bg-stone-50 border border-stone-100 rounded-xl py-2.5 px-2 flex flex-col items-center relative overflow-hidden">
                    <span className={`relative z-10 text-[10px] font-black uppercase tracking-widest mb-0.5 ${status.status === 'Busy' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      • {status.status}
                    </span>
                    <span className="relative z-10 text-[10px] text-stone-500 font-bold">{status.room}</span>
                  </div>
                </div>
              );
            })}
            {filteredStaff.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-400 text-sm">No operations staff found</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border-stone-200 text-stone-600 font-bold text-xs"
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-stone-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border-stone-200 text-stone-600 font-bold text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
