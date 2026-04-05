import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Hotel as HotelIcon, Loader2, BedDouble } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Room } from '../../types';
import { toast } from 'sonner';

export function StaffRooms() {
  const { rooms, hotels, roomTypes, isLoading, updateRoomStatus, refreshData } = useBooking();
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase animate-pulse">Loading Rooms...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'occupied': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'maintenance': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
      case 'cleaning': return { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' };
      case 'reserved': return { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const handleUpdateRoomStatus = (roomId: number, newStatus: Room['status']) => {
    updateRoomStatus(roomId, newStatus);
    toast.success(`Room status updated to ${newStatus}`);
  };

  const filteredRooms = selectedHotelId === "all" ? rooms : rooms.filter(room => room.hotel_id === parseInt(selectedHotelId));

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, typeof rooms>);

  const totalAvailable = filteredRooms.filter(r => r.status === 'available').length;
  const totalOccupied = filteredRooms.filter(r => r.status === 'occupied').length;

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="fade-up flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Room Status</h1>
          <p className="text-slate-500 mt-1">{filteredRooms.length} rooms • {totalAvailable} available • {totalOccupied} occupied</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <HotelIcon className="w-5 h-5 text-teal-600 ml-2" />
          <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
            <SelectTrigger className="w-[220px] border-0 focus:ring-0 font-semibold text-slate-700">
              <SelectValue placeholder="Select Hotel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hotels</SelectItem>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id.toString()}>{hotel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedRooms).sort(([a], [b]) => a.localeCompare(b)).map(([floor, floorRooms], index) => (
          <div key={floor} className="fade-up" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-900">Floor {floor}</span>
              <span className="text-xs text-slate-400">({floorRooms.length} rooms)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {floorRooms.map((room) => {
                const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                const colors = getStatusColor(room.status);
                return (
                  <div key={room.room_id} className={`bg-white rounded-xl border ${colors.border} p-4 hover:shadow-md transition-all`}>
                    <div className="text-center mb-3">
                      <p className="text-xl font-bold text-slate-900">{room.room_number}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{roomType?.name}</p>
                      {roomType?.bed_type && (
                        <p className="text-[9px] text-slate-300 font-medium">{roomType.bed_type} Bed</p>
                      )}
                    </div>
                    <div className={`${colors.bg} rounded-lg px-2 py-1.5 text-center mb-3`}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                        <span className={`text-xs font-bold ${colors.text}`}>{room.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {room.status !== 'available' && (
                        <Button size="sm" variant="outline" className="flex-[1_0_30%] text-[10px] h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-1"
                          onClick={() => handleUpdateRoomStatus(room.room_id, 'available')}>
                          Avail
                        </Button>
                      )}
                      {room.status !== 'cleaning' && (
                        <Button size="sm" variant="outline" className="flex-[1_0_30%] text-[10px] h-7 border-cyan-200 text-cyan-600 hover:bg-cyan-50 px-1"
                          onClick={() => handleUpdateRoomStatus(room.room_id, 'cleaning')}>
                          Clean
                        </Button>
                      )}
                      {room.status !== 'maintenance' && (
                        <Button size="sm" variant="outline" className="flex-[1_0_30%] text-[10px] h-7 border-amber-200 text-amber-600 hover:bg-amber-50 px-1"
                          onClick={() => handleUpdateRoomStatus(room.room_id, 'maintenance')}>
                          Maint.
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(groupedRooms).length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center text-slate-400">
            <BedDouble className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No rooms found</p>
          </div>
        )}
      </div>
    </div>
  );
}
