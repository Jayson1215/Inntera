import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, AlertCircle, ChevronRight, Eye, EyeOff, Loader2 } from 'lucide-react';
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
      toast.success('Access Granted');
      const userRole = result.user.role;
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'staff') navigate('/staff/dashboard');
      else navigate('/client/dashboard');
    } else {
      const errorMessage = result.error || 'Identity verification failed.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Side: Luxury Visual */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Inntera Luxury"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/95 via-stone-900/40 to-transparent"></div>
        
        {/* Floating Decorative Label */}
        <div className="absolute top-12 left-12 text-white/10 font-black text-[120px] select-none pointer-events-none leading-none tracking-tighter">
          SECURE
        </div>

        <div className="absolute bottom-20 left-20 right-20 text-white z-10">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 hover:opacity-80 transition-opacity group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
              <Hotel className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter">Inntera</span>
          </Link>
          <h2 className="text-7xl font-black tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Precision<br />
            <span className="text-emerald-400">Hospitality.</span>
          </h2>
          <p className="text-emerald-50/50 max-w-md font-medium leading-relaxed text-lg">
            Access the Caraga Region's most advanced booking infrastructure. Your journey to excellence starts here.
          </p>
        </div>

        {/* Subtle Bottom Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-30 pointer-events-none"></div>
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-[30%] flex flex-col bg-white relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 lg:p-10 relative z-10">
          
          <div className="w-full max-w-sm space-y-6">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Hotel className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-stone-900 tracking-tighter">Inntera</span>
              </Link>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-1 bg-emerald-500 rounded-full mb-4"></div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tighter uppercase italic">Identity Check</h1>
              <p className="text-stone-400 font-bold text-[9px] uppercase tracking-[0.3em]">SECURED TERMINAL ACCESS</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || authError) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-700 font-bold leading-relaxed">{error || authError}</p>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Universal ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@inntera.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-stone-50 border-stone-200 text-stone-900 h-11 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold px-4 placeholder:text-stone-300 border-2 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-stone-500 ml-1">Access Token</Label>
                  <Link to="/" className="text-[9px] text-emerald-600 hover:text-emerald-700 font-black tracking-widest uppercase transition-colors">Recovery</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-stone-50 border-stone-200 text-stone-900 h-11 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all pr-12 font-bold px-4 placeholder:text-stone-300 border-2 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-stone-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all shadow-xl shadow-stone-900/20 mt-4 flex items-center justify-center gap-3 group active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Validating...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Terminal</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-100"></span>
              </div>
              <div className="relative flex justify-center text-[8px]">
                <span className="bg-white px-4 text-stone-300 font-black uppercase tracking-[0.4em]">Alternative Auth</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white border-2 border-stone-100 text-stone-700 hover:bg-stone-50 hover:border-emerald-200 font-black text-[9px] uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center group active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 mr-3 transition-transform group-hover:scale-110">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-3.17 0-5.92 1.86-7.22 4.56l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google Access</span>
            </Button>

            <div className="text-center pt-4">
              <p className="text-stone-400 font-bold text-[9px] uppercase tracking-[0.1em]">
                Unauthorized?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-black transition-all underline underline-offset-4 decoration-emerald-500/20 hover:decoration-emerald-500">
                  Register
                </Link>
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 text-[8px] font-black text-stone-200 uppercase tracking-[0.3em] text-center">
            V1.0.0 • SECURED
          </div>
        </div>
      </div>
    </div>
  );
}
