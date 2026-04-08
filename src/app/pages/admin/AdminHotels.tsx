import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Edit, Trash2, MapPin, Phone, AlertCircle, Loader2, Building2, ImageIcon, FileText } from 'lucide-react';
import { Hotel } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { HotelCreateSchema, HotelUpdateSchema } from '../../validations';
import { toast } from 'sonner';
import { z } from 'zod';

export function AdminHotels() {
  const { hotels, isLoading, addHotel, updateHotel, deleteHotel } = useBooking();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-[#0066FF]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Global Property Network...</p>
      </div>
    );
  }

  const validateForm = (): boolean => {
    try {
      if (editingHotel) {
        HotelUpdateSchema.parse(formData);
      } else {
        HotelCreateSchema.parse(formData);
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
        console.error('Validation failed:', newErrors);
        toast.error('Please check the required fields');
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
      if (editingHotel) {
        result = await updateHotel(editingHotel.id, formData);
      } else {
        result = await addHotel(formData);
      }

      if (result.success) {
        toast.success(editingHotel ? 'Property record updated' : 'New property registered');
        setIsDialogOpen(false);
        setEditingHotel(null);
        setFormData({});
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (err) {
      toast.error('A system error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (hotelId: number) => {
    if (confirm('Are you sure you want to PERMANENTLY REMOVE this property from the global network?')) {
      const result = await deleteHotel(hotelId);
      if (result.success) {
        toast.success('Property removed successfully');
      } else {
        toast.error(result.error || 'Failed to remove property');
      }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hotel Management</h1>
          <p className="text-sm text-slate-500">Manage your property list and contact details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm px-4 py-2 font-semibold transition-all active:scale-95 text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-xl shadow-2xl p-6">
            <DialogTitle className="text-xl font-bold mb-4">{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
            <DialogDescription className="sr-only">
              {editingHotel ? 'Update the details for this property record.' : 'Enter the details for a new property to register in the global network.'}
            </DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Hotel Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter hotel name"
                    className={`pl-10 h-10 rounded-lg ${errors.name ? 'border-red-500 ring-red-50' : 'border-slate-200'}`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm font-semibold text-slate-700">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className={`h-10 rounded-lg ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.city && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.city}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className={`h-10 rounded-lg ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.phone}</p>}
                </div>
              </div>



              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-semibold text-slate-700">Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    className={`pl-10 h-10 rounded-lg ${errors.address ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {errors.address && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{errors.address}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="image_url" className="text-sm font-semibold text-slate-700">Property Image URL</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1.5">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="image_url"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="pl-10 h-10 rounded-lg border-slate-200"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">Paste a direct link to a hotel photo (JPEG, PNG, etc.)</p>
                  </div>
                  <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-200" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Property Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the unique features of this property..."
                    className="w-full min-h-[80px] pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={closeDialog} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingHotel ? 'Save Changes' : 'Add Hotel'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-20 px-6 py-3 font-semibold text-slate-700">Photo</TableHead>
              <TableHead className="px-6 py-3 font-semibold text-slate-700">Hotel Name</TableHead>
              <TableHead className="px-6 py-3 font-semibold text-slate-700">Location</TableHead>
              <TableHead className="px-6 py-3 font-semibold text-slate-700">Phone</TableHead>

              <TableHead className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {hotel.image_url ? (
                      <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{hotel.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">{hotel.display_id || 'HTL-GEN-000'}</span>
                      {hotel.star_rating && (
                        <div className="flex gap-0.5 ml-1">
                          {[...Array(hotel.star_rating)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">{hotel.city}</TableCell>
                <TableCell className="px-6 py-4 text-slate-600">{hotel.phone}</TableCell>

                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(hotel)} className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(hotel.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hotels.length === 0 && (
          <div className="py-20 text-center">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No hotels found</h3>
            <p className="text-sm text-slate-500">Start by adding your first property</p>
          </div>
        )}
      </div>
    </div>
  );
}
