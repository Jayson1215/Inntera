import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { BookingProvider } from '../context/BookingContext';
import { 
  Search,
  Calendar,
  User,
  LogOut,
  Hotel
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { MobileNav } from '../components/MobileNav';
import { NotificationBell } from '../components/ui/NotificationBell';

export function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated or not guest/client
    if (!user || user.role !== 'guest') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'guest') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-gray-600 mt-2">You don't have permission to access this area.</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center uppercase tracking-tighter">
            <Link to="/client/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">Inntera</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-l border-gray-200 pl-4 ml-4 flex items-center gap-3">
                <NotificationBell />
                <span className="text-sm font-semibold text-gray-900">{user?.name || 'Guest'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 active:scale-95"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
               <NotificationBell />
               <span className="text-sm font-bold text-gray-900 truncate max-w-[80px]">{user?.name?.split(' ')[0] || 'Guest'}</span>
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 active:scale-90"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
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

