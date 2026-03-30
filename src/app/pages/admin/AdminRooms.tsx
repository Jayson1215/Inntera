import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit } from 'lucide-react';
import { rooms, Room, hotels, roomTypes } from '../../data/mockData';
import { toast } from 'sonner';

export function AdminRooms() {
  const [roomList, setRoomList] = useState<Room[]>(rooms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [filterHotel, setFilterHotel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      case 'available': return 'bg-green-100 text-green-700';
      case 'occupied': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'reserved': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
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
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map(hotel => (
                      <SelectItem key={hotel.hotel_id} value={hotel.hotel_id.toString()}>
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
                    <SelectValue placeholder="Select room type" />
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
                    <SelectValue placeholder="Select status" />
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
      <Card className="mb-6">
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
                    <SelectItem key={hotel.hotel_id} value={hotel.hotel_id.toString()}>
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => {
                const hotel = hotels.find(h => h.hotel_id === room.hotel_id);
                const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                return (
                  <TableRow key={room.room_id}>
                    <TableCell className="font-medium">{room.room_number}</TableCell>
                    <TableCell>{hotel?.name}</TableCell>
                    <TableCell>{roomType?.name}</TableCell>
                    <TableCell>{room.floor}</TableCell>
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

