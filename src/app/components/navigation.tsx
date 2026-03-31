import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Hotel, LogOut } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-emerald-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-700">Inntera</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-600 capitalize">{user.role} Account</p>
                </div>
                <div className="flex items-center gap-3">
                  {user.role === 'guest' && (
                    <>
                      <Link to="/client/dashboard">
                        <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/client/search">
                        <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
                          Search Hotels
                        </Button>
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard">
                      <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  {user.role === 'staff' && (
                    <Link to="/staff/dashboard">
                      <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                        Staff Portal
                      </Button>
                    </Link>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

