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
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAF8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAF8]">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-stone-400 mt-2">You don't have permission to access the Partner Hub.</p>
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
      <div className="p-6 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/10">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black text-stone-800 tracking-tight">Partner Hub</h1>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">{user?.name || 'Administrator'}</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold tracking-tight ${
                isActive
                  ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-stone-400 hover:text-red-600 hover:bg-red-50 font-bold transition-all text-xs uppercase tracking-widest px-4"
          onClick={handleLogout}
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-stone-100 shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-100 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6 text-stone-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg md:text-xl font-bold text-stone-800 tracking-tight">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <NotificationBell />
             <div className="h-8 w-[1px] bg-stone-100 hidden sm:block" />
             <div className="flex items-center gap-3">
               <div className="hidden sm:flex flex-col items-end">
                 <span className="text-sm font-bold text-stone-800">{user?.name}</span>
                 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest pl-1 py-0.5 rounded border border-amber-100 mt-1 bg-amber-50">Admin</span>
               </div>
               <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center group cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm">
                  <UserCog className="w-5 h-5 text-stone-400 group-hover:text-amber-600" />
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth pb-20 md:pb-8">
          <BookingProvider>
            <div className="max-w-7xl mx-auto">
               <Outlet />
            </div>
          </BookingProvider>
        </main>
      </div>
    </div>
  );
}
