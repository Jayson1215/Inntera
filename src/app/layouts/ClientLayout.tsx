import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { BookingProvider } from '../context/BookingContext';
import { 
  Search,
  Calendar,
  User,
  LogOut,
  Hotel,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { MobileNav } from '../components/MobileNav';
import { NotificationBell } from '../components/ui/NotificationBell';

export function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'guest') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAF8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'guest') {
    return (
      <div className="flex items-center justify-center h-screen bg-[#E8E6E3]">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-stone-500 mt-2">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/client/dashboard', icon: User, label: 'Dashboard' },
    { path: '/client/search', icon: Search, label: 'Search Hotels' },
    { path: '/client/bookings', icon: Calendar, label: 'My Bookings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top Navigation — Warm Light */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/client/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-amber-500/15">
                <Hotel className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">
                <span className="text-amber-600">Inn</span><span className="text-stone-800">tera</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-l border-stone-100 pl-4 ml-4 flex items-center gap-3">
                <NotificationBell />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-200/60">
                    <Sparkles size={12} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-stone-500">{user?.name || 'Guest'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-300 hover:text-red-500 hover:bg-red-50 active:scale-95 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
               <NotificationBell />
               <span className="text-xs font-bold text-stone-500 truncate max-w-[80px]">{user?.name?.split(' ')[0] || 'Guest'}</span>
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 active:scale-90"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <BookingProvider>
          <Outlet />
        </BookingProvider>
      </main>

      {/* Mobile Navigation Bar */}
      <MobileNav />
    </div>
  );
}
