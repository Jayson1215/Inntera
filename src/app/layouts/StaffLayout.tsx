import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookingProvider } from '../context/BookingContext';
import { useEffect } from 'react';
import { 
  LayoutDashboard,
  Calendar,
  BedDouble,
  ClipboardCheck,
  LogOut,
  Sparkles,
  Menu,
  User,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { NotificationBell } from '../components/ui/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function StaffLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'staff') {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-stone-400 mt-2">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/staff/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/staff/rooms', icon: BedDouble, label: 'Room Status' },
    { path: '/staff/checkin', icon: ClipboardCheck, label: 'Check-in/out' },
    { path: '/staff/cleaning', icon: Sparkles, label: 'Cleaning & Staff' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full bg-white border-r border-stone-200 shadow-[10px_0_40px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-stone-900 tracking-tighter leading-none">Inntera Ops</h1>
            <p className="text-[9px] font-bold text-stone-900 uppercase tracking-[0.2em] mt-1.5 leading-none">Staff Terminal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black text-stone-900 uppercase tracking-[0.2em] mb-5 ml-4">Duty Roster</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[11px] font-bold uppercase tracking-wider group ${
                isActive
                   ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-900 hover:bg-stone-50 hover:text-emerald-600'
              }`}
            >
              <div className={`transition-all duration-200 ${isActive ? 'text-emerald-600' : 'text-stone-900 group-hover:text-emerald-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
         <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[10px] font-black text-stone-900 shadow-sm">
                  {(user?.name || 'S').charAt(0)}
               </div>
               <div className="overflow-hidden">
                  <p className="text-[11px] font-black text-stone-900 truncate uppercase tracking-tight">{user?.name}</p>
                  <p className="text-[9px] font-bold text-stone-900 uppercase tracking-widest">Active Staff</p>
               </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start h-10 text-stone-900 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all text-[9px] uppercase tracking-[0.2em] px-3 rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              End Shift
            </Button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 z-50">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50/50 relative">
        <header className="px-6 md:px-6 py-6 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden bg-white shadow-sm rounded-xl border border-stone-200 w-10 h-10">
                  <Menu className="w-5 h-5 text-stone-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-none">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 mb-1">
                 <p className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em]">Operations</p>
                 <ChevronRight size={10} className="text-stone-900" />
                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">{navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}</p>
              </div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white border border-stone-200 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
               <div className="p-1">
                 <NotificationBell />
               </div>
               
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-4 pr-4 pl-2 border-l border-stone-100 ml-1 cursor-pointer group">
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-bold text-stone-900 leading-none tracking-tight">{user?.name}</span>
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                           Online
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center group-hover:border-emerald-200 transition-all active:scale-95">
                         <User className="w-4 h-4 text-stone-900 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-stone-200 shadow-2xl bg-white">
                    <DropdownMenuLabel className="px-3 py-2">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Authenticated as</p>
                      <p className="text-sm font-black text-stone-900 tracking-tight">{user?.name}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{user?.role}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-stone-100" />
                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-stone-900 font-bold text-xs focus:bg-stone-50 focus:text-emerald-600 cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Manage Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-stone-100" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2.5 text-rose-600 font-bold text-xs focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      End Shift & Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth pb-20 md:pb-8">
          <BookingProvider>
            <div className="space-y-8 pb-10">
               <Outlet />
            </div>
          </BookingProvider>
        </main>
      </div>
    </div>
  );
}
