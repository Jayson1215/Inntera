import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { 
  LayoutDashboard,
  Calendar,
  BedDouble,
  ClipboardCheck,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function StaffLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated or not staff
    if (!user || user.role !== 'staff') {
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

  if (user.role !== 'staff') {
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
    { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/staff/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/staff/rooms', icon: BedDouble, label: 'Room Status' },
    { path: '/staff/checkin', icon: ClipboardCheck, label: 'Check-in/out' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Staff Portal</h1>
          <p className="text-sm text-gray-500 mt-1">{user.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

