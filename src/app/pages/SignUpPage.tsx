import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Hotel, UserPlus, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'guest' | 'staff'>('guest');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await signup({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role,
    });

    if (result.success && result.user) {
      toast.success('Account created successfully! Welcome to Inntera');
      if (result.user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/client/dashboard');
    } else {
      toast.error(result.error || 'Failed to create account');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Side: Luxury Visual */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Inntera Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-stone-950/95 via-stone-900/40 to-transparent"></div>
        
        {/* Floating Decorative Label */}
        <div className="absolute top-12 left-12 text-white/10 font-black text-[120px] select-none pointer-events-none leading-none tracking-tighter">
          ELITE
        </div>

        <div className="absolute bottom-20 left-20 right-20 text-white z-10">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 hover:opacity-80 transition-opacity group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
              <Hotel className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter">Inntera</span>
          </Link>
          <h2 className="text-7xl font-black tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Join the<br />
            <span className="text-emerald-400">Elite Network.</span>
          </h2>
          <p className="text-emerald-50/50 max-w-md font-medium leading-relaxed text-lg">
            Unlock exclusive member rates, early check-ins, and seamless bookings across the entire Caraga Region.
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
          
          <div className="w-full max-w-sm space-y-4 py-4">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Hotel className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-stone-900 tracking-tighter">Inntera</span>
              </Link>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-1 bg-emerald-500 rounded-full mb-2"></div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tighter uppercase italic">Create Account</h1>
              <p className="text-stone-400 font-bold text-[9px] uppercase tracking-[0.3em]">GLOBAL REGISTRATION</p>
            </div>

            {/* Role Selector */}
            <div className="p-1 bg-stone-50 border border-stone-200/60 rounded-xl flex gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setRole('guest')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all font-black text-[8px] uppercase tracking-widest ${
                  role === 'guest'
                    ? 'bg-white text-stone-900 shadow-md ring-1 ring-stone-900/5'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Sparkles size={10} className={role === 'guest' ? 'text-emerald-500' : ''} />
                Guest
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all font-black text-[8px] uppercase tracking-widest ${
                  role === 'staff'
                    ? 'bg-white text-stone-900 shadow-md ring-1 ring-stone-900/5'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Hotel size={10} className={role === 'staff' ? 'text-emerald-500' : ''} />
                Staff
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-stone-500 ml-1">First Name</Label>
                  <Input name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} 
                    className="bg-stone-50 border-stone-200 text-stone-900 h-9 rounded-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold px-3 text-xs border-2" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-stone-500 ml-1">Last Name</Label>
                  <Input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} 
                    className="bg-stone-50 border-stone-200 text-stone-900 h-9 rounded-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold px-3 text-xs border-2" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[8px] font-black uppercase tracking-widest text-stone-500 ml-1">Universal ID</Label>
                <Input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} 
                  className="bg-stone-50 border-stone-200 text-stone-900 h-9 rounded-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold px-3 text-xs border-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-stone-500 ml-1">Secret Key</Label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••" value={formData.password} onChange={handleInputChange} 
                      className="bg-stone-50 border-stone-200 text-stone-900 h-9 rounded-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all pr-8 font-bold px-3 text-xs border-2" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors">
                      {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[8px] font-black uppercase tracking-widest text-stone-500 ml-1">Confirm</Label>
                  <Input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••" value={formData.confirmPassword} onChange={handleInputChange} 
                    className="bg-stone-50 border-stone-200 text-stone-900 h-9 rounded-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold px-3 text-xs border-2" />
                </div>
              </div>

              {Object.values(errors).some(e => e) && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-2 flex gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[8px] text-red-700 font-bold leading-tight">{Object.values(errors).filter(e => e)[0]}.</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-stone-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[9px] rounded-lg transition-all shadow-xl shadow-stone-900/20 mt-2 flex items-center justify-center active:scale-[0.98] group"
              >
                {isLoading ? 'Provisioning...' : (
                  <>
                    <span>Begin Journey</span>
                    <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-stone-400 font-bold text-[8px] uppercase tracking-[0.1em]">
                Registered?{' '}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-black transition-all underline underline-offset-4 decoration-emerald-500/20 hover:decoration-emerald-500">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 text-[8px] font-black text-stone-200 uppercase tracking-[0.3em] text-center">
            V1.0.0 • REGISTRATION
          </div>
        </div>
      </div>
    </div>
  );
}
