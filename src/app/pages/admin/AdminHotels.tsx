import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, MapPin, Phone, AlertCircle } from 'lucide-react';
import { hotels, Hotel } from '../../data/mockData';
import { HotelCreateSchema } from '../../validations';
import { toast } from 'sonner';
import { z } from 'zod';

export function AdminHotels() {
  const [hotelList, setHotelList] = useState<Hotel[]>(hotels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    try {
      HotelCreateSchema.parse(formData);
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
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingHotel) {
        setHotelList(hotelList.map(h => 
          h.hotel_id === editingHotel.hotel_id ? { ...h, ...formData } : h
        ));
        toast.success('Hotel updated successfully');
      } else {
        const newHotel: Hotel = {
          hotel_id: Math.max(...hotelList.map(h => h.hotel_id), 0) + 1,
          name: formData.name || '',
          address: formData.address || '',
          city: formData.city || '',
          phone: formData.phone || '',
          timezone: formData.timezone || 'America/New_York',
          created_at: new Date().toISOString(),
        };
        setHotelList([...hotelList, newHotel]);
        toast.success('Hotel added successfully');
      }
      setIsDialogOpen(false);
      setEditingHotel(null);
      setFormData({});
    } catch (err) {
      toast.error('Failed to save hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (hotelId: number) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setHotelList(hotelList.filter(h => h.hotel_id !== hotelId));
      toast.success('Hotel deleted successfully');
    }
  };

  const openEditDialog = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData(hotel);
    setErrors({});
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingHotel(null);
    setFormData({});
    setErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingHotel(null);
    setFormData({});
    setErrors({});
  };

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore'
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels Management</h1>
          <p className="text-gray-500 mt-1">Manage your hotel properties ({hotelList.length})</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">Please fix:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}><span className="font-medium">{field}:</span> {message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter hotel name"
                  className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter street address"
                  className={errors.address ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  className={errors.city ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <select
                  id="timezone"
                  value={formData.timezone || 'America/New_York'}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingHotel ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {hotelList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hotels found. Create your first hotel to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelList.map((hotel) => (
                  <TableRow key={hotel.hotel_id}>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {hotel.city}, {hotel.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        {hotel.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{hotel.timezone}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(hotel)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hotel.hotel_id)}
                        title="Delete"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
