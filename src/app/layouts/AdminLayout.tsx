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
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { NotificationBell } from '../components/ui/NotificationBell';

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-950 rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Admin</h1>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user?.name || 'Administrator'}</p>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-tight ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border-l-4 border-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-bold transition-all active:scale-95"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout System
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Responsive Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <NotificationBell />
             <div className="hidden sm:flex flex-col items-end pl-2 border-l border-slate-100">
               <span className="text-sm font-black text-gray-900">{user?.name}</span>
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Administrator</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center">
                <UserCog className="w-4 h-4 text-emerald-700" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth pb-20 md:pb-8">
          <BookingProvider>
            <div className="max-w-7xl mx-auto space-y-6">
               <Outlet />
            </div>
          </BookingProvider>
        </main>
      </div>
    </div>
  );
}

