import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Edit, Trash2, Loader2, BedDouble, Building2, X } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Room } from '../../types';
import { RoomCreateSchema, RoomUpdateSchema } from '../../validations';
import { toast } from 'sonner';

export function AdminRooms() {
  const { rooms, hotels, roomTypes, isLoading, addRoom, updateRoom, deleteRoom, refreshData } = useBooking();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [filterHotel, setFilterHotel] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');

  if (isLoading) return <div className="h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-12 h-12" /></div>;

  const validate = () => {
    try { (editingRoom ? RoomUpdateSchema : RoomCreateSchema).parse(formData); return true; }
    catch (err: any) {
      const newErrors: any = {};
      err.errors.forEach((e: any) => newErrors[e.path[0]] = e.message);
      setValidationErrors(newErrors);
      toast.error("Validation failed");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await (editingRoom ? updateRoom(editingRoom.room_id, formData) : addRoom(formData));
    if (res.success) { toast.success("Inventory updated"); refreshData(); setIsDialogOpen(false); }
    else toast.error(res.error || "Operation failed");
  };

  const uniqueFloors = Array.from(new Set(rooms.map(r => r.floor))).filter(Boolean).sort();

  const filtered = rooms.filter(r => {
    const matchesHotel = filterHotel === 'all' || r.hotel_id.toString() === filterHotel;
    const matchesFloor = filterFloor === 'all' || r.floor === filterFloor;
    return matchesHotel && matchesFloor;
  });

  const getNextRoomNumber = (hId: number, fl: string) => {
    const flNum = parseInt(fl);
    const suffix = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
    const flStr = isNaN(flNum) ? fl : `${flNum}${suffix(flNum)}`;
    
    const hotelRooms = rooms.filter(r => r.hotel_id === hId && (r.floor === fl || r.floor === flStr || r.floor === flNum.toString()));
    if (hotelRooms.length === 0) return `${flNum}01`;
    const nums = hotelRooms.map(r => parseInt(r.room_number)).filter(n => !isNaN(n));
    if (nums.length === 0) return `${flNum}01`;
    return (Math.max(...nums) + 1).toString();
  };

  return (
    <div className="space-y-8 p-4 md:p-8 -m-4 md:-m-8 bg-[#f8fafc] min-h-screen">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 border-b-4 border-emerald-500 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white tracking-tighter">Room Inventory</h1>
          <p className="text-slate-900 mt-2">Manage global assets and track operational readiness.</p>
        </div>
        <Button onClick={() => { setEditingRoom(null); setFormData({ status: 'available' }); setValidationErrors({}); setIsDialogOpen(true); }} className="relative z-10 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 h-14 rounded-2xl">
          <Plus className="mr-2" /> ADD ROOM
        </Button>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] shadow-xl flex justify-end items-center gap-4">
        <Select value={filterFloor} onValueChange={setFilterFloor}>
          <SelectTrigger className="h-14 w-48 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-sm">
            <SelectValue placeholder="All Floors" />
          </SelectTrigger>
          <SelectContent className="z-[200] rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <SelectItem value="all">All Floors</SelectItem>
            {uniqueFloors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterHotel} onValueChange={setFilterHotel}>
          <SelectTrigger className="h-14 w-48 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-sm">
            <SelectValue placeholder="All Hotels" />
          </SelectTrigger>
          <SelectContent className="z-[200] rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <SelectItem value="all">All Hotels</SelectItem>
            {hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(r => {
          const hotel = hotels.find(h => h.id === r.hotel_id);
          const type = roomTypes.find(t => t.room_type_id === r.room_type_id);
          return (
            <div key={r.room_id} className="rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
              <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] group-hover:bg-emerald-500/30 transition-all duration-500" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    r.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}> {r.status} </div>
                </div>
                <h3 className="text-2xl font-black text-white relative z-10 tracking-tight">Room {r.room_number}</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mt-2 relative z-10">
                  <Building2 className="w-3 h-3" /> {hotel?.name}
                </p>
              </div>
              <div className="bg-white p-6 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room Type</span>
                  <span className="text-sm font-black text-slate-900">{type?.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingRoom(r); setFormData(r); setValidationErrors({}); setIsDialogOpen(true); }} className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white transition-colors"> <Edit className="w-4 h-4" /> </Button>
                  <Button size="icon" variant="ghost" onClick={() => confirm("Delete room?") && deleteRoom(r.room_id)} className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-rose-500 hover:text-white transition-colors"> <Trash2 className="w-4 h-4" /> </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-popup">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <h3 className="text-2xl font-black">{editingRoom ? 'Update Room' : 'ADD ROOM'}</h3>
              <button onClick={() => setIsDialogOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-900 ml-1">Hotel</Label>
                  <Select value={formData.hotel_id?.toString()} onValueChange={v => {
                    const hId = parseInt(v);
                    setFormData({ ...formData, hotel_id: hId, room_type_id: undefined, room_number: formData.floor ? getNextRoomNumber(hId, formData.floor) : '' });
                  }}>
                    <SelectTrigger className="h-12 bg-white border border-slate-900 rounded-xl font-bold"> <SelectValue placeholder="Select" /> </SelectTrigger>
                    <SelectContent className="z-[201] rounded-xl bg-white backdrop-blur-none shadow-2xl"> {hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>)} </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-900 ml-1">Type</Label>
                  <Select value={formData.room_type_id?.toString()} onValueChange={v => {
                    const typeId = parseInt(v);
                    const type = roomTypes.find(t => t.room_type_id === typeId);
                    let newFloor = formData.floor;
                    
                    if (type) {
                      const floorMatch = type.name.match(/(\d+)(?:st|nd|rd|th)\s+Floor/i);
                      if (floorMatch) {
                        newFloor = floorMatch[1];
                      }
                    }

                    setFormData({ 
                      ...formData, 
                      room_type_id: typeId, 
                      floor: newFloor,
                      room_number: (formData.hotel_id && newFloor) ? getNextRoomNumber(formData.hotel_id, newFloor) : formData.room_number 
                    });
                  }} disabled={!formData.hotel_id}>
                    <SelectTrigger className="h-12 bg-white border border-slate-900 rounded-xl font-bold"> <SelectValue placeholder="Select" /> </SelectTrigger>
                    <SelectContent className="z-[201] rounded-xl bg-white backdrop-blur-none shadow-2xl"> {roomTypes.filter(t => t.hotel_id === formData.hotel_id).map(t => <SelectItem key={t.room_type_id} value={t.room_type_id.toString()}>{t.name}</SelectItem>)} </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-900 ml-1">Room Number</Label>
                  <Input value={formData.room_number || ''} onChange={e => setFormData({ ...formData, room_number: e.target.value })} className={`h-12 bg-white border border-slate-900 rounded-xl font-bold ${validationErrors.room_number ? 'ring-2 ring-rose-500' : ''}`} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-900 ml-1">Floor</Label>
                  <Select value={formData.floor?.toString()} onValueChange={v => {
                    setFormData({ ...formData, floor: v, room_number: formData.hotel_id ? getNextRoomNumber(formData.hotel_id, v) : '' });
                  }}>
                    <SelectTrigger className="h-12 bg-white border border-slate-900 rounded-xl font-bold"> <SelectValue placeholder="Select" /> </SelectTrigger>
                    <SelectContent className="z-[201] rounded-xl bg-white backdrop-blur-none shadow-2xl"> {[1, 2, 3, 4, 5, 6].map(f => <SelectItem key={f} value={f.toString()}>Level {f}</SelectItem>)} </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-900 ml-1">Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger className="h-12 bg-white border border-slate-900 rounded-xl font-bold capitalize"> <SelectValue /> </SelectTrigger>
                  <SelectContent className="z-[201] rounded-xl bg-white backdrop-blur-none shadow-2xl"> {['available', 'cleaning', 'occupied', 'maintenance', 'reserved'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)} </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-xl">Add Room</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
