import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Room } from '../../types';
import { toast } from 'sonner';

export function AdminRooms() {
  const { rooms, hotels, roomTypes, isLoading } = useBooking();
  const [roomList, setRoomList] = useState<Room[]>(rooms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [filterHotel, setFilterHotel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setRoomList(rooms);
  }, [rooms]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Inventorying Room Availability...</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      setRoomList(roomList.map(r => 
        r.room_id === editingRoom.room_id ? { ...r, ...formData } : r
      ));
      toast.success('Room updated successfully');
    } else {
      const newRoom: Room = {
        room_id: Math.max(...roomList.map(r => r.room_id)) + 1,
        hotel_id: formData.hotel_id || 1,
        room_type_id: formData.room_type_id || 1,
        room_number: formData.room_number || '',
        floor: formData.floor || '',
        status: (formData.status as Room['status']) || 'available',
        notes: formData.notes || '',
      };
      setRoomList([...roomList, newRoom]);
      toast.success('Room added successfully');
    }
    setIsDialogOpen(false);
    setEditingRoom(null);
    setFormData({});
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingRoom(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const filteredRooms = roomList.filter(room => {
    if (filterHotel !== 'all' && room.hotel_id !== parseInt(filterHotel)) return false;
    if (filterStatus !== 'all' && room.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-200 text-green-800 font-semibold';
      case 'occupied': return 'bg-blue-200 text-blue-800 font-semibold';
      case 'maintenance': return 'bg-yellow-200 text-yellow-800 font-semibold';
      case 'reserved': return 'bg-purple-200 text-purple-800 font-semibold';
      default: return 'bg-gray-200 text-gray-800 font-semibold';
    }
  };

  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); }
        .table-row { transition: all 0.3s ease; border-bottom: 1px solid #000 !important; }
        .table-row:hover { background-color: #f0fdf4; }
        thead { background-color: #f3f4f6; }
        thead th { font-weight: 700; color: #374151; padding: 14px; }
        tbody td { color: #374151; }
        label { color: #111827 !important; }
        [role="combobox"] { color: #374151 !important; background-color: #ffffff !important; }
        [role="combobox"] span { color: #374151 !important; }
        [role="listbox"] { background-color: #ffffff !important; border: 1px solid #d1d5db !important; }
        [role="option"] { color: #111827 !important; background-color: #ffffff !important; }
        [role="option"]:hover { background-color: #f3f4f6 !important; }
        [role="option"][aria-selected="true"] { background-color: #e0f2fe !important; color: #111827 !important; }
        [role="dialog"] { background-color: #ffffff !important; }
        [role="dialog"] label { color: #111827 !important; }
        [role="dialog"] input { color: #374151 !important; background-color: #ffffff !important; }
        [role="dialog"] h2 { color: #111827 !important; }
        [role="dialog"] p { color: #374151 !important; }
        [role="dialog"] button { color: #ffffff !important; }
        [data-slot="select-content"] { background-color: #ffffff !important; }
        [data-slot="select-item"] { color: #111827 !important; }
      `}</style>
      
      <div className="flex justify-between items-center mb-8 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-500 mt-1">Manage room inventory and status</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotel_id">Hotel</Label>
                <Select
                  value={formData.hotel_id?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, hotel_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel">
                      {formData.hotel_id ? hotels.find(h => h.id === formData.hotel_id)?.name : 'Select hotel'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(hotel => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_type_id">Room Type</Label>
                <Select
                  value={formData.room_type_id?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, room_type_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type">
                      {formData.room_type_id ? roomTypes.find(rt => rt.room_type_id === formData.room_type_id)?.name : 'Select room type'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type.room_type_id} value={type.room_type_id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input
                  id="room_number"
                  value={formData.room_number || ''}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  value={formData.floor || ''}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Room['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status">
                      {formData.status ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1) : 'Select status'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoom ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6 table-card border border-gray-200 rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Filter by Hotel</Label>
              <Select value={filterHotel} onValueChange={setFilterHotel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  {hotels.map(hotel => (
                    <SelectItem key={hotel.id} value={hotel.id.toString()}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="table-card border border-gray-200 animate-fade-in-up rounded-xl overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Bed Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => {
                const hotel = hotels.find(h => h.id === room.hotel_id);
                const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                return (
                  <TableRow key={room.room_id}>
                    <TableCell className="font-medium">{room.room_number}</TableCell>
                    <TableCell>{hotel?.name}</TableCell>
                    <TableCell>{roomType?.name}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 font-bold border-slate-200">
                        {roomType?.bed_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(room)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

