import { useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { roomTypes } from '../../data/mockData';
import { Room } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'sonner';

export function StaffRooms() {
  const { rooms, updateRoomStatus, refreshFromStorage } = useBooking();

  // Refresh data from storage when component mounts
  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-200 text-green-800 font-semibold';
      case 'occupied': return 'bg-blue-200 text-blue-800 font-semibold';
      case 'maintenance': return 'bg-yellow-200 text-yellow-800 font-semibold';
      case 'reserved': return 'bg-purple-200 text-purple-800 font-semibold';
      default: return 'bg-gray-200 text-gray-800 font-semibold';
    }
  };

  const handleUpdateRoomStatus = (roomId: number, newStatus: Room['status']) => {
    updateRoomStatus(roomId, newStatus);
    toast.success(`Room status updated to ${newStatus}`);
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1e7e5; }
        .room-card { background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); border: 1px solid #d1e7e5; }
        .room-card:hover { box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15); transition: all 0.3s ease; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); }
        .room-number { color: #047857; font-weight: 700; }
        .room-type { color: #059669; }
        button { color: #047857; border-color: #d1e7e5; }
        button:hover { background-color: #f0fdf4; color: #047857; }
      `}</style>
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Room Status</h1>
        <p className="text-gray-500 mt-1">Manage room availability and status</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedRooms).map(([floor, floorRooms]) => (
          <Card key={floor} className="table-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Floor {floor}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {floorRooms.map((room) => {
                  const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
                  return (
                    <div key={room.room_id} className="p-4 border rounded-lg room-card">
                      <div className="text-center mb-3">
                        <p className="text-xl font-bold room-number">{room.room_number}</p>
                        <p className="text-xs room-type">{roomType?.name}</p>
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
                            onClick={() => handleUpdateRoomStatus(room.room_id, 'available')}
                          >
                            Available
                          </Button>
                        )}
                        {room.status !== 'maintenance' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleUpdateRoomStatus(room.room_id, 'maintenance')}
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

