import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, Loader2, BedDouble, Filter, Search, Building2, Layers, Info } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Room } from '../../types';
import { RoomCreateSchema, RoomUpdateSchema } from '../../validations';
import { toast } from 'sonner';
import { z } from 'zod';

export function AdminRooms() {
  const { rooms, hotels, roomTypes, isLoading, addRoom, updateRoom, deleteRoom } = useBooking();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterHotel, setFilterHotel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Inventorying Global Availability...</p>
      </div>
    );
  }

  const validateForm = (): boolean => {
    try {
      if (editingRoom) {
        RoomUpdateSchema.parse(formData);
      } else {
        RoomCreateSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        toast.error('Please check required fields');
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let result;
      if (editingRoom) {
        result = await updateRoom(editingRoom.room_id, formData);
      } else {
        result = await addRoom(formData);
      }

      if (result.success) {
        toast.success(editingRoom ? 'Unit inventory updated' : 'New unit registered');
        setIsDialogOpen(false);
        setEditingRoom(null);
        setFormData({});
        setErrors({});
      } else {
        toast.error(result.error || 'Failed to save unit');
      }
    } catch (err) {
      toast.error('A system error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    if (confirm('Permanently remove this unit from inventory?')) {
      const result = await deleteRoom(roomId);
      if (result.success) {
        toast.success('Unit removed from inventory');
      } else {
        toast.error(result.error || 'Failed to remove unit');
      }
    }
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setErrors({});
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingRoom(null);
    setFormData({});
    setErrors({});
    setIsDialogOpen(true);
  };

  const filteredRooms = rooms.filter(room => {
    if (filterHotel !== 'all' && room.hotel_id !== parseInt(filterHotel)) return false;
    if (filterStatus !== 'all' && room.status !== filterStatus) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hotel = hotels.find(h => h.id === room.hotel_id);
      const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
      
      const matchesRoomNumber = room.room_number.toLowerCase().includes(searchLower);
      const matchesHotelName = hotel?.name.toLowerCase().includes(searchLower);
      const matchesRoomType = roomType?.name.toLowerCase().includes(searchLower);
      
      if (!matchesRoomNumber && !matchesHotelName && !matchesRoomType) return false;
    }
    
    return true;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'occupied': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'maintenance': return 'bg-red-50 text-red-600 border-red-100';
      case 'reserved': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'cleaning': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>
      
      <div className="fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Room Inventory</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">Manage units, status and property mapping</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm px-5 py-2 font-bold transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
               <DialogTitle className="text-xl font-bold tracking-tight">{editingRoom ? 'Update Unit Info' : 'Register New Unit'}</DialogTitle>
               <DialogDescription className="sr-only">
                 {editingRoom ? 'Update the inventory details for this specific room unit.' : 'Enter the details to register a new unit into the property inventory.'}
               </DialogDescription>
               <p className="text-blue-100 text-[10px] mt-1 font-black uppercase tracking-widest">Inventory Management System</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="hotel_id" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Property</Label>
                    <Select
                      value={formData.hotel_id?.toString() || ""}
                      onValueChange={(value) => setFormData({ ...formData, hotel_id: parseInt(value) })}
                    >
                      <SelectTrigger className={`bg-slate-50 text-xs font-bold ${errors.hotel_id ? 'border-red-500' : 'border-slate-200'}`}>
                        <SelectValue placeholder="Select Property" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map(hotel => (
                          <SelectItem key={hotel.id} value={hotel.id.toString()}>{hotel.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hotel_id && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.hotel_id}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="room_type_id" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</Label>
                    <Select
                      value={formData.room_type_id?.toString() || ""}
                      onValueChange={(value) => setFormData({ ...formData, room_type_id: parseInt(value) })}
                    >
                      <SelectTrigger className={`bg-slate-50 text-xs font-bold ${errors.room_type_id ? 'border-red-500' : 'border-slate-200'}`}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(type => (
                          <SelectItem key={type.room_type_id} value={type.room_type_id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.room_type_id && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.room_type_id}</p>}
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="room_number" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room No.</Label>
                  <Input
                    id="room_number"
                    value={formData.room_number || ''}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    required
                    className={`bg-slate-50 text-xs font-bold ${errors.room_number ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.room_number && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.room_number}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="floor" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level / Floor</Label>
                  <Input
                    id="floor"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    required
                    className={`bg-slate-50 text-xs font-bold ${errors.floor ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.floor && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.floor}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Status</Label>
                  <Select
                    value={formData.status || "available"}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Room['status'] })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-xs font-bold">
                      <SelectValue placeholder="Set Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Ready for Sales</SelectItem>
                      <SelectItem value="cleaning">Under Housekeeping</SelectItem>
                      <SelectItem value="occupied">Stay In Progress</SelectItem>
                      <SelectItem value="maintenance">Out of Order</SelectItem>
                      <SelectItem value="reserved">Blocked/Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div className="flex gap-3 justify-end pt-6">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md px-6 py-2 font-bold transition-all active:scale-95">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : editingRoom ? 'Update Unit' : 'Save Unit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="fade-up bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4" style={{ animationDelay: '100ms' }}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search by Room ID / Unit No..." 
              className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterHotel} onValueChange={setFilterHotel}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium">
               <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="All Hotels" />
               </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {hotels.map(h => (
                <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm font-medium">
               <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="Status" />
               </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="fade-up bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ animationDelay: '150ms' }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Unit Identity</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Category Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Location</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Unit Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredRooms.map((room) => {
                const hotel = hotels.find(h => h.id === room.hotel_id);
                const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                return (
                  <tr key={room.room_id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                             <BedDouble className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-900 tracking-tight">Room {room.room_number}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{hotel?.name}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-700">{roomType?.name}</span>
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{roomType?.bed_type}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100 text-slate-500">
                          <Layers className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Floor {room.floor}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(room.status)}`}>
                          <div className={`w-1 h-1 rounded-full ${room.status === 'available' ? 'bg-blue-600 animate-pulse' : 'bg-current'}`} />
                          {room.status}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(room)} className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(room.room_id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
          {filteredRooms.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                  <BedDouble className="w-8 h-8 text-slate-100" />
               </div>
               <h3 className="text-sm font-bold text-slate-900">No rooms match your filter</h3>
               <p className="text-xs text-slate-500 mt-1">Adjust your search parameters to find inventory units.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

