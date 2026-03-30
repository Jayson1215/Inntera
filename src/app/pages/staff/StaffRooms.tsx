import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { rooms, Room, roomTypes } from '../../data/mockData';
import { toast } from 'sonner';

export function StaffRooms() {
  const [roomList, setRoomList] = useState<Room[]>(rooms);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'occupied': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'reserved': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const updateRoomStatus = (roomId: number, newStatus: Room['status']) => {
    setRoomList(roomList.map(r => 
      r.room_id === roomId ? { ...r, status: newStatus } : r
    ));
    toast.success(`Room status updated to ${newStatus}`);
  };

  const groupedRooms = roomList.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Room Status</h1>
        <p className="text-gray-500 mt-1">Manage room availability and status</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedRooms).map(([floor, floorRooms]) => (
          <Card key={floor}>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Floor {floor}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {floorRooms.map((room) => {
                  const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                  return (
                    <div key={room.room_id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-center mb-3">
                        <p className="text-xl font-bold text-gray-900">{room.room_number}</p>
                        <p className="text-xs text-gray-500">{roomType?.name}</p>
                      </div>
                      <Badge className={`w-full justify-center mb-3 ${getStatusColor(room.status)}`}>
                        {room.status}
                      </Badge>
                      <div className="flex gap-2">
                        {room.status !== 'available' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => updateRoomStatus(room.room_id, 'available')}
                          >
                            Available
                          </Button>
                        )}
                        {room.status !== 'maintenance' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => updateRoomStatus(room.room_id, 'maintenance')}
                          >
                            Maintenance
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

