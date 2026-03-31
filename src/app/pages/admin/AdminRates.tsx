import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { rates, hotels, roomTypes } from '../../data/mockData';

export function AdminRates() {
  return (
    <div className="p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .table-card { background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); }
        .table-row { transition: all 0.3s ease; }
        .table-row:hover { background-color: #f0fdf4; }
        thead { background-color: #f3f4f6; }
        thead th { font-weight: 700; color: #374151; padding: 14px; }
        tbody td { color: #374151; }
      `}</style>
      
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900">Rates Management</h1>
        <p className="text-gray-500 mt-1">Manage room rates and pricing</p>
      </div>

      <Card className="table-card border border-gray-200 animate-fade-in-up rounded-xl overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => {
                const hotel = hotels.find(h => h.hotel_id === rate.hotel_id);
                const roomType = roomTypes.find(rt => rt.room_type_id === rate.room_type_id);
                return (
                  <TableRow key={rate.rate_id}>
                    <TableCell className="font-medium">{hotel?.name}</TableCell>
                    <TableCell>{roomType?.name}</TableCell>
                    <TableCell>{new Date(rate.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(rate.end_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">₱{rate.price.toLocaleString()}</TableCell>
                    <TableCell>{rate.currency}</TableCell>
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

