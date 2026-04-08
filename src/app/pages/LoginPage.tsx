import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, AlertCircle, ChevronRight, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/api/auth/google/redirect`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success && result.user) {
      toast.success('Authentication successful');
      const userRole = result.user.role;
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'staff') navigate('/staff/dashboard');
      else navigate('/client/dashboard');
    } else {
      const errorMessage = result.error || 'Authentication failed. Verify your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16 bg-gradient-to-br from-amber-50 via-amber-50/50 to-[#FAFAF8] border-r border-stone-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-xl shadow-amber-500/15 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              <span className="text-amber-600">Inn</span><span className="text-stone-800">tera</span>
            </span>
          </Link>

          <h2 className="text-5xl font-black text-stone-800 tracking-tight leading-[1.1] mb-6">
            Welcome<br />
            <span className="text-amber-600">Back.</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-sm mb-12">
            Access your reservations, manage bookings, and explore Butuan City's finest luxury accommodations.
          </p>

          <div className="flex items-center gap-6 pt-8 border-t border-stone-200/60">
            <div className="text-center">
              <p className="text-2xl font-black text-amber-600">4.9</p>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">Rating</p>
            </div>
            <div className="w-px h-10 bg-stone-200/60"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-stone-700">24/7</p>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">Support</p>
            </div>
            <div className="w-px h-10 bg-stone-200/60"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-stone-700">1K+</p>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/15">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-amber-600">Inn</span><span className="text-stone-800">tera</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                <Lock size={14} className="text-amber-600" />
              </div>
              <span className="text-[10px] font-bold text-amber-600/60 uppercase tracking-[0.3em]">Secure Portal</span>
            </div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Sign In</h1>
            <p className="text-stone-400 text-sm">Enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <div className="bg-white border border-stone-100 rounded-3xl p-8 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || authError) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">{error || authError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-stone-50/50 border border-stone-200 text-stone-800 placeholder:text-stone-300 h-13 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all font-medium px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Password</Label>
                  <Link to="/" className="text-[9px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-widest transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-stone-50/50 border border-stone-200 text-stone-800 placeholder:text-stone-300 h-13 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all pr-14 font-medium px-4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-13 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 mt-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 group"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-4 text-stone-300 font-bold tracking-widest">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-600 font-medium rounded-xl transition-all flex items-center justify-center group shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-3 transition-transform group-hover:scale-110">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-3.17 0-5.92 1.86-7.22 4.56l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
            </Button>

            <div className="mt-8 text-center pt-6 border-t border-stone-50">
              <p className="text-stone-400 font-medium text-xs">
                Don't have an account?{' '}
                <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
