import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { BookingProvider } from '../context/BookingContext';
import { 
  Building2, 
  BedDouble, 
  Calendar, 
  Users, 
  UserCog, 
  DollarSign, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/hotels', icon: Building2, label: 'Hotels' },
    { path: '/admin/rooms', icon: BedDouble, label: 'Rooms' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/guests', icon: Users, label: 'Guests' },
    { path: '/admin/staff', icon: UserCog, label: 'Staff' },
    { path: '/admin/rates', icon: DollarSign, label: 'Rates' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-950 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin</h1>
          </div>
          <p className="text-xs text-gray-600">{user.name}</p>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <Button
            className="w-full justify-start bg-emerald-900 hover:bg-emerald-950 text-white text-sm py-2 rounded-md transition-all active:scale-95"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </header>
        <main className="flex-1 p-8">
          <BookingProvider>
            <Outlet />
          </BookingProvider>
        </main>
      </div>
    </div>
  );
}

