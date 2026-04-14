import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, AlertCircle, ChevronRight, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:inline">
              <span className="text-emerald-600">Inn</span><span className="text-slate-800">tera</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Premium Hotel Management</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex font-sans">
        {/* Right Panel — Form */}
        <div className="w-full flex items-center justify-center px-6 py-12 relative z-10 bg-white">
          <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your Inntera account to continue</p>
          </div>

          {/* Form Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || authError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error || authError}</p>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-800">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all font-medium px-4 hover:border-slate-300"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-800">Password</Label>
                  <Link to="/" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all pr-12 font-medium px-4 hover:border-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-600/40 hover:shadow-emerald-600/60 mt-8 text-base flex items-center justify-center gap-2 group active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-semibold rounded-lg transition-all flex items-center justify-center group shadow-sm hover:shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2.5 transition-transform group-hover:scale-110">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-3.17 0-5.92 1.86-7.22 4.56l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-base font-semibold">Google</span>
            </Button>

            <div className="mt-8 text-center pt-6 border-t border-slate-200/60">
              <p className="text-slate-700 font-medium text-sm">
                New to Inntera?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors underline-offset-2 hover:underline">
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
