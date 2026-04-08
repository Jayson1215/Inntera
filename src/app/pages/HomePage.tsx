import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Hotel, MapPin, Calendar, ArrowRight, Star, Phone, Mail, Shield, Sparkles, Award, Globe } from 'lucide-react';
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

export function HomePage() {
  const { hotels } = useBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setHeroLoaded(true), 300);
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

  const featuredHotelsData = hotels.slice(0, 4).map((h, i) => ({
    name: h.name,
    location: h.city,
    rating: ['4.9', '4.8', '4.7', '4.9'][i] || '4.8',
    price: `₱${(Number(h.star_rating || 4) * 3000).toLocaleString()}`,
    image: h.image_url || [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ][i] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stars: h.star_rating || 4
  }));

  return (
    <div className="homepage-container bg-[#FAFAF8]">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500 flex items-center justify-between px-6 lg:px-16 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-stone-100 h-16' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-500/15">
            <Hotel size={16} strokeWidth={2.5} />
          </div>
          <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-stone-800' : 'text-white'}`}>
            <span className={isScrolled ? 'text-amber-600' : 'text-amber-400'}>Inn</span>tera
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          <a href="#home" className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled ? 'text-black hover:text-amber-600' : 'text-white/70 hover:text-amber-400'}`}>Home</a>
          <a href="#destinations" className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled ? 'text-black hover:text-amber-600' : 'text-white/70 hover:text-amber-400'}`}>Destinations</a>
          <a href="#about-us" className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled ? 'text-black hover:text-amber-600' : 'text-white/70 hover:text-amber-400'}`}>Experience</a>
          <a href="#contact" className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${isScrolled ? 'text-black hover:text-amber-600' : 'text-white/70 hover:text-amber-400'}`}>Contact</a>
        </nav>

        <Link to="/login">
          <Button className="rounded-full px-8 h-10 font-bold text-[10px] uppercase tracking-[0.2em] bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-lg shadow-amber-500/10 transition-all duration-300">
            Reserve Now
          </Button>
        </Link>
      </header>

      {/* Hero — Video stays dark (it's a video overlay) */}
      <section id="home" className="relative h-screen min-h-[700px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/mHg5clAi2AQ?autoplay=1&mute=1&controls=0&loop=1&playlist=mHg5clAi2AQ&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&start=5`}
            title="Butuan City Aerial View"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full object-cover scale-[2] pointer-events-none"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#FAFAF8]"></div>
        </div>

        <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-amber-400/60"></div>
            <span className="text-amber-300 text-[11px] font-bold tracking-[0.4em] uppercase">Butuan City, Philippines</span>
            <div className="h-px w-12 bg-amber-400/60"></div>
          </div>
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            Discover<br />
            <span className="text-amber-400">Paradise</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base font-medium max-w-lg mb-10 leading-relaxed">
            Experience luxury accommodations in the heart of Caraga Region. Where heritage meets modern elegance.
          </p>
          <Link to="/login">
            <button className="group h-14 px-12 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full transition-all duration-300 shadow-2xl shadow-amber-600/20 active:scale-95 flex items-center gap-3">
              Explore Hotels
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Search Widget */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-12">
        <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 flex flex-col lg:flex-row items-center gap-1">
          <div className="flex-1 w-full group p-5 hover:bg-stone-50 rounded-xl transition-all cursor-pointer border-b lg:border-b-0 lg:border-r border-stone-100">
            <label className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">Destination</label>
            <div className="flex items-center gap-2">
              <MapPin className="text-amber-500 w-4 h-4 flex-shrink-0" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="border-0 p-0 h-auto font-bold text-stone-800 text-base shadow-none focus:ring-0 bg-transparent">
                  <SelectValue placeholder="Where to?" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-stone-200 text-stone-800">
                  {cities.map((city) => (
                    <SelectItem key={city} value={city} className="font-bold text-stone-700 hover:bg-amber-50 focus:bg-amber-50 focus:text-amber-700">{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center p-5 hover:bg-stone-50 rounded-xl transition-all cursor-pointer border-b lg:border-b-0 lg:border-r border-stone-100">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">Check-in</label>
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-500 w-4 h-4 flex-shrink-0" />
                <Input type="date" value={checkInDate} onChange={(e) => handleCheckInChange(e.target.value)} className="border-0 p-0 h-6 font-bold text-stone-800 text-base shadow-none focus-visible:ring-0 bg-transparent" />
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex items-center p-5 hover:bg-stone-50 rounded-xl transition-all cursor-pointer border-b lg:border-b-0 lg:border-r border-stone-100">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">Check-out</label>
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-500 w-4 h-4 flex-shrink-0" />
                <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="border-0 p-0 h-6 font-bold text-stone-800 text-base shadow-none focus-visible:ring-0 bg-transparent" />
              </div>
            </div>
          </div>

          <Link to="/login" className="w-full lg:w-auto self-stretch">
            <button className="h-full w-full lg:px-10 py-5 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10 text-xs">
              Search
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Hotels */}
      <section id="destinations" className="py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-amber-500"></div>
              <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em]">Curated Selection</span>
            </div>
            <h2 className="text-4xl font-black text-black tracking-tight">Butuan's Finest<br /><span className="text-stone-500">Hotels & Resorts</span></h2>
          </div>
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-[0.2em] hover:gap-3 transition-all border-b border-amber-400/30 pb-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotelsData.map((hotel, index) => (
            <Card key={index} className="overflow-hidden border border-stone-100 bg-white rounded-2xl group cursor-pointer hover:-translate-y-2 transition-all duration-500 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="h-56 overflow-hidden bg-stone-100 relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-1">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-black text-lg text-white mb-1 tracking-tight leading-tight">{hotel.name}</h3>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {hotel.location}
                  </p>
                </div>
              </div>
              <CardContent className="p-5 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-black text-amber-700">{hotel.rating}</span>
                    </div>
                    <span className="text-[9px] font-bold text-black uppercase tracking-widest">Exceptional</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-black uppercase tracking-widest block">From</span>
                    <span className="text-lg font-black text-black tracking-tight">{hotel.price}</span>
                    <span className="text-[10px] text-black font-bold">/night</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about-us" className="py-28 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-amber-500"></div>
              <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em]">The Inntera Promise</span>
              <div className="h-px w-8 bg-amber-500"></div>
            </div>
            <h2 className="text-4xl font-black text-black tracking-tight">Why Travelers<br /><span className="text-stone-500">Choose Us</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-7 h-7" />, title: 'Secure Booking', text: 'Bank-level encryption for your peace of mind' },
              { icon: <Sparkles className="w-7 h-7" />, title: 'Best Rate', text: 'Guaranteed lowest prices or we match it' },
              { icon: <Award className="w-7 h-7" />, title: 'Premium Hotels', text: 'Handpicked, verified luxury accommodations' },
              { icon: <Globe className="w-7 h-7" />, title: '24/7 Support', text: 'Round-the-clock multilingual concierge' },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group p-8 rounded-2xl bg-white border border-stone-100 hover:border-amber-200 transition-all duration-500 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-amber-100 group-hover:border-amber-600 group-hover:shadow-xl group-hover:shadow-amber-500/15">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-black text-black mb-3 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-black font-medium text-xs leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-amber-50 to-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-6">
            Your Perfect Stay<br />
            <span className="text-amber-600">Awaits in Butuan</span>
          </h2>
          <p className="text-black text-base max-w-lg mx-auto mb-10 leading-relaxed">
            From riverside retreats to city-center luxury. Discover the best hotels that Butuan City has to offer.
          </p>
          <Link to="/login">
            <button className="h-14 px-12 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full transition-all duration-300 shadow-xl shadow-amber-500/15 active:scale-95">
              Start Booking Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-stone-100 py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white">
                <Hotel size={18} />
              </div>
              <span className="text-2xl font-black tracking-tight text-stone-800"><span className="text-amber-600">Inn</span>tera</span>
            </div>
            <p className="text-black max-w-sm leading-relaxed font-medium text-sm mb-6">
              Premium hotel booking platform serving Butuan City and the Caraga Region. Trusted by thousands of travelers for secure, seamless reservations.
            </p>
            <div className="flex gap-3">
              {['FB', 'IG', 'TW'].map(social => (
                <div key={social} className="w-9 h-9 bg-stone-50 rounded-full flex items-center justify-center text-black text-[10px] font-bold hover:bg-amber-600 hover:text-white transition-all cursor-pointer border border-stone-100">
                  {social}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black mb-6 uppercase tracking-[0.2em] text-[10px]">Quick Links</h4>
            <div className="space-y-3 text-black text-sm font-medium">
              <p className="hover:text-amber-600 cursor-pointer transition-colors">About Us</p>
              <p className="hover:text-amber-600 cursor-pointer transition-colors">Privacy Policy</p>
              <p className="hover:text-amber-600 cursor-pointer transition-colors">Terms of Service</p>
              <p className="hover:text-amber-600 cursor-pointer transition-colors">Careers</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black mb-6 uppercase tracking-[0.2em] text-[10px]">Contact</h4>
            <div className="space-y-3 text-black text-sm font-medium">
              <p className="flex items-center gap-2"><Mail size={14} className="text-amber-500" /> info@inntera.com</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-amber-500" /> +63 85 000 0000</p>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Butuan City, Philippines</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black text-xs font-medium">© 2026 Inntera. All rights reserved.</p>
          <p className="text-black text-xs font-medium">Butuan City, Agusan del Norte, Philippines</p>
        </div>
      </footer>
    </div>
  );
}
