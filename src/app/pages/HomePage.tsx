import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Hotel,
  MapPin,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Phone,
  Mail,
} from 'lucide-react';
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
import { useBooking } from '../context/BookingContext';
import './HomePage.css';

// Asset Imports
import heroImg from '../../assets/images/hero.png';
import hotelExtImg from '../../assets/images/hotel-exterior.png';

export function HomePage() {
  const { hotels } = useBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (hotels.length > 0) {
      const uniqueCities = [...new Set(hotels.map(hotel => hotel.city))].sort();
      setCities(uniqueCities);
    }
  }, [hotels]);

  const handleCheckInChange = (date: string) => {
    setCheckInDate(date);
    if (date) {
      const checkIn = new Date(date);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);
      const checkOutFormatted = checkOut.toISOString().split('T')[0];
      setCheckOutDate(checkOutFormatted);
    }
  };

  const featuredHotelsData = hotels.slice(0, 4).map(h => ({
    name: h.name,
    location: h.city,
    rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1),
    price: `₱${(Math.floor(Math.random() * (8000 - 3000) + 3000)).toLocaleString()}/night`,
    image: '🏨'
  }));

  const features = [
    { icon: <Star className="w-8 h-8" />, title: 'Best Prices', text: 'Find the lowest rates across millions of hotels worldwide' },
    { icon: <Hotel className="w-8 h-8" />, title: 'Verified Reviews', text: 'Read honest guest reviews to make informed decisions' },
    { icon: <ArrowRight className="w-8 h-8" />, title: 'Easy Booking', text: 'Book instantly with instant confirmation and flexibility' },
  ];

  return (
    <div className="homepage-container">


      {/* Premium Header */}
      <header className={`premium-header ${isScrolled ? 'fixed' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-inntera-teal rounded flex items-center justify-center text-white">
            <Hotel size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-inntera-text-dark">Inntera</span>
        </div>

        <nav className="nav-links hidden lg:flex">
          <a href="#home" className="nav-link text-inntera-teal">Home</a>
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button className="bg-inntera-teal hover:bg-inntera-teal-dark text-white rounded-none px-8 font-bold uppercase tracking-widest text-xs hidden sm:block">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-stars flex justify-center gap-1 mb-4 animate-up">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="white" />
            ))}
          </div>
          <div className="hero-title-box animate-up delay-1">
            <h2 className="hero-subtitle serif-font">Welcome to Inntera</h2>
            <h1 className="hero-main-title serif-font">HOTEL BOOKING SYSTEM</h1>
          </div>
        </div>
      </section>

      {/* Booking Widget Overlay */}
      <div className="booking-widget-container animate-up delay-2">
        <div className="booking-widget">
          {/* Location Field */}
          <div className="booking-field">
            <label className="booking-label">Location</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="border-0 p-0 h-auto font-bold text-inntera-text-dark shadow-none focus:ring-0">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-inntera-teal" />
                      {city}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Check-In Field */}
          <div className="booking-field">
            <label className="booking-label">Check In</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-inntera-teal" />
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="border-0 p-0 h-auto font-bold text-inntera-text-dark shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Check-Out Field */}
          <div className="booking-field">
            <label className="booking-label">Check Out</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-inntera-teal" />
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                disabled={!checkInDate}
                className="border-0 p-0 h-auto font-bold text-inntera-text-dark shadow-none focus-visible:ring-0 disabled:bg-transparent"
              />
            </div>
          </div>

          {/* Guests Field */}
          <div className="booking-field">
            <label className="booking-label">Guests</label>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-inntera-teal" />
              <Input
                type="number"
                placeholder="1"
                min="1"
                className="border-0 p-0 h-auto font-bold text-inntera-text-dark shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <Link to="/login" className="flex">
            <button className="booking-button h-full px-12">Search</button>
          </Link>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about-us" className="intro-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="intro-content">
            <div className="intro-text-side">
              <span className="section-label">Our Story</span>
              <h2 className="section-title serif-font">About Inntera</h2>
              <p className="section-desc">
                Inntera is your premier luxury booking platform, dedicated to connecting travelers with the world's most exquisite hotels and resorts. We've streamlined the discovery process to help you find and secure the perfect stay, combining a handpicked collection of elite properties with a seamless, intuitive booking experience.
              </p>
              <p className="section-desc">
                From tranquil beachside villas to sophisticated city-center suites, our platform offers unparalleled access to premium accommodations across the globe. With real-time availability, verified reviews, and a commitment to exceptional service, Inntera ensures your journey begins with confidence and ease.
              </p>
              <Link to="/login">
                <button className="primary-btn">Explore Stays</button>
              </Link>
            </div>
            <div className="image-wrapper">
              <img src={hotelExtImg} alt="Hotel Exterior" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties (Functional Data) */}
      <section className="py-20 bg-inntera-gray-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Our Properties</span>
            <h2 className="section-title serif-font">Featured Locations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHotelsData.map((hotel, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                <div className="h-48 bg-slate-50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {hotel.image}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-inntera-text-dark mb-1">{hotel.name}</h3>
                  <p className="text-sm text-inntera-gray mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-inntera-teal" />
                    {hotel.location}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-inntera-text-dark">{hotel.rating}</span>
                    </div>
                    <span className="text-lg font-black text-inntera-teal">{hotel.price}</span>
                  </div>
                  <Link to="/login">
                    <Button className="w-full bg-inntera-teal hover:bg-inntera-teal-dark text-white font-bold py-3 lowercase">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Functional Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group border border-slate-100 p-10 rounded-2xl hover:border-inntera-teal transition-all duration-300">
                <div className="w-20 h-20 bg-inntera-teal-light rounded-full flex items-center justify-center mx-auto mb-6 text-inntera-teal group-hover:bg-inntera-teal group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-inntera-text-dark mb-4">{feature.title}</h3>
                <p className="text-inntera-gray leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer-section bg-neutral-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-inntera-teal rounded flex items-center justify-center text-white">
                <Hotel size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter">Inntera</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Experience the pinnacle of luxury booking with Inntera. Our curated selection of world-class
              properties ensures an unforgettable stay every time.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-inntera-teal">Information</h4>
            <div className="space-y-4 text-slate-400">
              <p className="hover:text-white cursor-pointer transition-colors">Our Hotels</p>
              <p className="hover:text-white cursor-pointer transition-colors">Dining Experience</p>
              <p className="hover:text-white cursor-pointer transition-colors">Wellness & Spa</p>
              <p className="hover:text-white cursor-pointer transition-colors">Special Offers</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-sm tracking-widest text-inntera-teal">Contact Us</h4>
            <div className="space-y-4 text-slate-400">
              <p className="flex items-center gap-2"><Mail size={16} /> info@inntera.com</p>
              <p className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</p>
              <p className="flex items-center gap-2"><MapPin size={16} /> Santorini, GR</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

