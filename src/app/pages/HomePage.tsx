import { Link } from 'react-router-dom';
import { Hotel, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function HomePage() {
  const features = [
    {
      icon: Hotel,
      title: 'Multiple Hotels',
      description: 'Manage multiple hotel properties from a single platform',
    },
    {
      icon: Shield,
      title: 'Secure Bookings',
      description: 'Safe and secure payment processing for all reservations',
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Different portals for admins, staff, and guests',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Hotel className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">HotelBook</span>
            </div>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Enterprise Hotel Booking System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for managing hotel operations, bookings, and guest services.
            Built for administrators, staff, and guests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Credentials */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Demo Credentials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Admin Portal</h3>
              <p className="text-sm text-gray-600 mb-2">Email: admin@hotelbook.com</p>
              <p className="text-sm text-gray-600">Password: admin123</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Staff Portal</h3>
              <p className="text-sm text-gray-600 mb-2">Email: mike.davis@grandplaza.com</p>
              <p className="text-sm text-gray-600">Password: staff123</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Guest Portal</h3>
              <p className="text-sm text-gray-600 mb-2">Email: alice@example.com</p>
              <p className="text-sm text-gray-600">Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

