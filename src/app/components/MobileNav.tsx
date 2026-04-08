import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: any;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/client/dashboard', icon: User, label: 'Profile' },
  { path: '/client/search', icon: Search, label: 'Search' },
  { path: '/client/bookings', icon: Calendar, label: 'Bookings' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                isActive ? 'text-amber-600' : 'text-stone-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-amber-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
