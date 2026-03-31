import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Hotel, MapPin, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { hotels } from '../data/mockData';

export function HomePage() {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  const handleCheckInChange = (date: string) => {
    setCheckInDate(date);
    if (date) {
      // Automatically set checkout to next day
      const checkIn = new Date(date);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);
      const checkOutFormatted = checkOut.toISOString().split('T')[0];
      setCheckOutDate(checkOutFormatted);
    }
  };

  useEffect(() => {
    // Extract unique cities from mock data
    const uniqueCities = [...new Set(hotels.map(hotel => hotel.city))].sort();
    setCities(uniqueCities);
  }, []);

  const featuredHotels = [
    { name: 'Grand Plaza Hotel', location: 'Manila', rating: 4.8, price: '₱8,250/night', image: '🏨' },
    { name: 'Luxury Beach Resort', location: 'Boracay', rating: 4.9, price: '₱11,000/night', image: '🏖️' },
    { name: 'Mountain Peak Lodge', location: 'Baguio', rating: 4.7, price: '₱6,600/night', image: '⛰️' },
    { name: 'City Center Inn', location: 'Makati', rating: 4.6, price: '₱9,900/night', image: '🌆' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out;
        }
        .hotel-card {
          animation: slideInUp 0.6s ease-out;
        }
        .hotel-card:nth-child(1) { animation-delay: 0.1s; }
        .hotel-card:nth-child(2) { animation-delay: 0.2s; }
        .hotel-card:nth-child(3) { animation-delay: 0.3s; }
        .hotel-card:nth-child(4) { animation-delay: 0.4s; }
        .feature-item {
          animation: fadeInUp 0.6s ease-out;
        }
        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 animate-fade-in-down">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-emerald-700">Inntera</span>
            </div>
            <Link to="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg animate-fade-in-down">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-emerald-50 via-white to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in-down">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Find Your <span className="text-emerald-600">Perfect Hotel</span>
            </h1>
            <p className="text-gray-600 text-xl">
              Book hotels at the best prices with confidence
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in-up border border-emerald-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-white border border-gray-200 rounded-lg focus:border-emerald-500 h-10">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Check-in</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-500">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <Input 
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="border-0 p-0 text-sm w-full focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Check-out</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-500">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <Input 
                    type="date" 
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    disabled={!checkInDate}
                    className="border-0 p-0 text-sm w-full focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Guests</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-500">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <Input type="number" placeholder="1" min="1" className="border-0 p-0 text-sm w-full focus:outline-none" />
                </div>
              </div>

              <div className="flex items-end">
                <Link to="/login" className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center animate-fade-in-up">Featured Properties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel, index) => (
            <Card key={index} className="hotel-card border border-emerald-100 overflow-hidden transition-all hover:shadow-lg cursor-pointer">
              <div className="h-48 bg-emerald-50 flex items-center justify-center text-6xl">
                {hotel.image}
              </div>
              <CardContent className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-700 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {hotel.location}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{hotel.rating}</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{hotel.price}</span>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-item text-center p-8 rounded-xl bg-white shadow-md border border-emerald-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">Find the lowest rates across millions of hotels worldwide</p>
            </div>

            <div className="feature-item text-center p-8 rounded-xl bg-white shadow-md border border-emerald-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hotel className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Reviews</h3>
              <p className="text-gray-600">Read honest guest reviews to make informed decisions</p>
            </div>

            <div className="feature-item text-center p-8 rounded-xl bg-white shadow-md border border-emerald-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book instantly with instant confirmation and flexibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-8 border border-emerald-200 shadow-md hover:shadow-lg transition-all animate-slide-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Demo Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">👑 Admin Portal</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-emerald-600">Email:</span> admin@inntera.com</p>
              <p className="text-sm text-gray-600"><span className="font-medium text-emerald-600">Password:</span> admin123</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">👔 Staff Portal</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-emerald-600">Email:</span> mike.davis@grandplaza.com</p>
              <p className="text-sm text-gray-600"><span className="font-medium text-emerald-600">Password:</span> staff123</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-emerald-100 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">🏨 Guest Portal</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-emerald-600">Email:</span> alice@example.com</p>
              <p className="text-sm text-gray-600"><span className="font-medium text-emerald-600">Password:</span> password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

