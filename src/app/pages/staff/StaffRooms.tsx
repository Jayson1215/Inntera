import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Hotel as HotelIcon, Loader2, BedDouble, User, Mail, Phone, Calendar, CreditCard, Filter } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Room, Guest, Booking } from '../../types';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { toast } from 'sonner';

export function StaffRooms() {
  const { rooms, hotels, roomTypes, bookings, guests, isLoading, updateRoomStatus, refreshData } = useBooking();
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-semibold text-stone-900 tracking-widest uppercase animate-pulse">Loading Rooms...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'occupied': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'maintenance': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'cleaning': return { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' };
      case 'reserved': return { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const handleUpdateRoomStatus = (roomId: number, newStatus: Room['status']) => {
    updateRoomStatus(roomId, newStatus);
    toast.success(`Room status updated to ${newStatus}`);
  };

  const filteredRooms = rooms.filter(room => {
    if (selectedHotelId !== "all" && room.hotel_id !== parseInt(selectedHotelId)) return false;
    if (selectedStatus !== "all" && room.status !== selectedStatus) return false;
    return true;
  });

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, typeof rooms>);

  const totalAvailable = filteredRooms.filter(r => r.status === 'available').length;
  const totalOccupied = filteredRooms.filter(r => r.status === 'occupied').length;

  const getActiveBooking = (roomId: number) => {
    return bookings.find(b => 
      (b.booking_status === 'checked-in' || b.booking_status === 'confirmed') && 
      b.booking_rooms?.some((br: any) => br.room_id === roomId)
    );
  };

  return (
    <>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
        {/* Inventory Matrix Hero Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-stone-950 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/10 text-indigo-400">
                  <BedDouble className="w-8 h-8" />
                </div>
                Inventory Matrix
              </h1>
              <p className="text-indigo-50/70 mt-3 text-sm lg:text-base font-medium max-w-lg">
                Live status monitoring across all physical assets. Manage turnover states and resolve maintenance tickets.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-end w-full md:w-auto">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-5 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-indigo-100 font-bold text-sm tracking-wide shadow-inner">
                  <span className="text-xl font-black text-white mr-2">{totalAvailable}</span> Available
                </span>
                <span className="px-5 py-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-indigo-100 font-bold text-sm tracking-wide shadow-inner">
                  <span className="text-xl font-black text-white mr-2">{totalOccupied}</span> Occupied
                </span>
              </div>
              
              {/* Filters integrated into Hero */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-1 pr-4 rounded-2xl border border-white/10 shadow-inner overflow-hidden w-full md:w-[240px]">
                  <div className="p-2 bg-indigo-500/30 rounded-xl m-1">
                    <HotelIcon className="w-4 h-4 text-indigo-200" />
                  </div>
                  <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                    <SelectTrigger className="w-full border-0 focus:ring-0 font-bold text-indigo-50 bg-transparent shadow-none border-none hover:bg-white/5 transition-colors">
                      <SelectValue placeholder="Select Hotel" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-white/10 text-white rounded-xl shadow-2xl">
                      <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">All Hotels</SelectItem>
                      {hotels.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id.toString()} className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">{hotel.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-1 pr-4 rounded-2xl border border-white/10 shadow-inner overflow-hidden w-full md:w-[200px]">
                  <div className="p-2 bg-indigo-500/30 rounded-xl m-1">
                    <Filter className="w-4 h-4 text-indigo-200" />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full border-0 focus:ring-0 font-bold text-indigo-50 bg-transparent shadow-none border-none hover:bg-white/5 transition-colors">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-white/10 text-white rounded-xl shadow-2xl">
                      <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">All Status</SelectItem>
                      <SelectItem value="available" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">Available</SelectItem>
                      <SelectItem value="occupied" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">Occupied</SelectItem>
                      <SelectItem value="cleaning" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">Cleaning</SelectItem>
                      <SelectItem value="maintenance" className="focus:bg-white/10 focus:text-white cursor-pointer font-bold">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedRooms).sort(([a], [b]) => a.localeCompare(b)).map(([floor, floorRooms]) => (
            <div key={floor}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-stone-900 uppercase tracking-widest">Floor {floor}</span>
                <span className="text-[10px] font-bold text-stone-900 opacity-40">({floorRooms.length} rooms)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {floorRooms.map((room) => {
                  const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                  const colors = getStatusColor(room.status);
                  return (
                    <div 
                      key={room.room_id} 
                      onClick={() => room.status === 'occupied' && setSelectedRoomDetails(room)}
                      className={`bg-white rounded-3xl border-2 ${colors.border} p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${room.status === 'occupied' ? 'cursor-pointer ring-offset-2 hover:ring-2 hover:ring-blue-500/20' : ''}`}
                    >
                      <div className="text-center mb-3">
                        <p className="text-xl font-black text-stone-900">{room.room_number}</p>
                        <p className="text-[10px] uppercase font-bold text-stone-900 mt-1">{roomType?.name}</p>
                        {roomType?.bed_type && (
                          <p className="text-[9px] text-stone-900 font-bold opacity-60 uppercase tracking-widest">{roomType.bed_type} Bed</p>
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
                            onClick={(e) => { e.stopPropagation(); handleUpdateRoomStatus(room.room_id, 'available'); }}>
                            Avail
                          </Button>
                        )}
                        {room.status !== 'cleaning' && (
                          <Button size="sm" variant="outline" className="flex-[1_0_30%] text-[10px] h-7 border-cyan-200 text-cyan-600 hover:bg-cyan-50 px-1"
                            onClick={(e) => { e.stopPropagation(); handleUpdateRoomStatus(room.room_id, 'cleaning'); }}>
                            Clean
                          </Button>
                        )}
                        {room.status !== 'maintenance' && (
                          <Button size="sm" variant="outline" className="flex-[1_0_30%] text-[10px] h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-1"
                            onClick={(e) => { e.stopPropagation(); handleUpdateRoomStatus(room.room_id, 'maintenance'); }}>
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
            <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm px-6 py-16 text-center text-stone-900">
              <BedDouble className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-black">No rooms found</p>
            </div>
          )}
        </div>
      </div>

      {/* Occupancy Details Modal */}
      <Dialog open={!!selectedRoomDetails} onOpenChange={(open) => !open && setSelectedRoomDetails(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          {selectedRoomDetails && (
            <OccupancyDetails 
              room={selectedRoomDetails}
              booking={getActiveBooking(selectedRoomDetails.room_id)}
              guest={guests.find(g => g.id === getActiveBooking(selectedRoomDetails.room_id)?.guest_id)}
              roomType={roomTypes.find(rt => rt.room_type_id === selectedRoomDetails.room_type_id)}
              onClose={() => setSelectedRoomDetails(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function OccupancyDetails({ room, booking, guest, roomType, onClose }: { room: Room, booking?: Booking, guest?: Guest, roomType?: any, onClose: () => void }) {
  return (
    <div className="flex flex-col">
      {/* Modal Header */}
      <div className="bg-stone-950 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Live Occupancy Details</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter">Room {room.room_number}</h2>
            <p className="text-sm font-bold text-stone-400 mt-1 uppercase tracking-widest">{roomType?.name}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-inner">
            <BedDouble className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-8 space-y-8">
        {booking && guest ? (
          <>
            {/* Guest Primary Identity */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
                {guest.first_name.charAt(0)}{guest.last_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-950 tracking-tight">{guest.first_name} {guest.last_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">Checked In</span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{booking.booking_reference}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Period</span>
                </div>
                <p className="text-sm font-black text-stone-900 tracking-tight">
                  {new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  <span className="mx-2 opacity-20">→</span>
                  {new Date(booking.checkout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Financials</span>
                </div>
                <p className="text-sm font-black text-stone-900 tracking-tight">₱{Number(booking.total_cost).toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Channels */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:border-blue-200 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Digital Channel</p>
                    <p className="text-sm font-bold text-stone-900">{guest.email}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:border-blue-200 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Secure Line</p>
                    <p className="text-sm font-bold text-stone-900">{guest.phone}</p>
                  </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2">
              <Button 
                onClick={onClose}
                className="w-full h-12 bg-stone-900 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-stone-200 transition-all active:scale-95"
              >
                Dismiss View
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-300">
              <User className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900 tracking-tight">No Active Ledger</h3>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Manual status override detected</p>
            </div>
            <Button 
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 px-8"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
