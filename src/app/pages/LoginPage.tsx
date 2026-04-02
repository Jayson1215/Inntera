import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success && result.user) {
      toast.success('Login successful!');
      
      const userRole = result.user.role;
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      const errorMessage = result.error || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string, role: 'admin' | 'staff' | 'client') => {
    setEmail(userEmail);
    setPassword(userPassword);
    
    const result = await login(userEmail, userPassword);
    if (result.success) {
      toast.success('Login successful!');
      // Navigate based on the provided role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      const errorMessage = result.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-transparent sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-sky-800 tracking-tighter">Inntera</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-wide italic uppercase">Welcome Back</h1>
            <p className="text-slate-500 font-bold tracking-[0.05em] text-xs uppercase">Please enter your details to sign in.</p>
          </div>

          {/* Main Login Card */}
          <Card className="border-2 border-sky-100 !bg-white shadow-2xl shadow-sky-200/20 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 !bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {(error || authError) && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">{error || authError}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-semibold ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 h-14 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-black font-semibold">Password</Label>
                    <Link to="/" className="text-xs text-sky-600 hover:text-sky-700 font-black uppercase tracking-wider transition">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 h-14 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all pr-12 font-bold px-5"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors text-sm font-bold"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-black rounded-xl transition-all shadow-lg shadow-sky-100 mt-6 text-sm uppercase tracking-widest"
                  disabled={isLoading}
                >
                  {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8 text-center border-t border-slate-100 pt-8">
                <p className="text-slate-500 font-medium text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-bold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Portals */}
          <div className="mt-8 grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="w-full h-12 bg-white border-slate-100 hover:bg-slate-50 text-slate-700 rounded-xl justify-start transition-all px-6 group shadow-sm"
              onClick={() => quickLogin('admin@inntera.com', 'admin123', 'admin')}
            >
              <span className="mr-4 text-lg transition-transform group-hover:scale-110">💎</span>
              <span className="font-bold text-[11px] uppercase tracking-[0.1em]">Admin Portal</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-white border-slate-100 hover:bg-slate-50 text-slate-700 rounded-xl justify-start transition-all px-6 group shadow-sm"
              onClick={() => quickLogin('receptionist.hotel1.1@inntera.com', 'password123', 'staff')}
            >
              <span className="mr-4 text-lg transition-transform group-hover:scale-110">💼</span>
              <span className="font-bold text-[11px] uppercase tracking-[0.1em]">Staff Access</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-white border-slate-100 hover:bg-slate-50 text-slate-700 rounded-xl justify-start transition-all px-6 group shadow-sm"
              onClick={() => quickLogin('juan@example.com', 'password123', 'client')}
            >
              <span className="mr-4 text-xl transition-transform group-hover:scale-110">🍷</span>
              <span className="font-bold text-[11px] uppercase tracking-[0.1em]">Guest Account</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
