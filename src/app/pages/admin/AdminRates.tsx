import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { rates, hotels, roomTypes } from '../../data/mockData';

export function AdminRates() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rates Management</h1>
        <p className="text-gray-500 mt-1">Manage room rates and pricing</p>
      </div>

      <Card>
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
                    <TableCell className="font-medium">${rate.price}</TableCell>
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

