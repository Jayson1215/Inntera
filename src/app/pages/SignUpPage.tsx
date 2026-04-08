import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Hotel, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react';
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

  const inputClass = (field: string) =>
    `bg-stone-50/50 border ${errors[field] ? 'border-red-300' : 'border-stone-200'} text-stone-800 placeholder:text-stone-300 h-12 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all font-medium px-4`;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center p-16 bg-gradient-to-br from-amber-50 via-amber-50/50 to-[#FAFAF8] border-r border-stone-100">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-[100px]"></div>
        
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
            Join the<br />
            <span className="text-amber-600">Experience.</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-sm mb-12">
            Create your account to unlock exclusive rates, manage reservations, and enjoy premium stays across Butuan City.
          </p>

          <div className="space-y-4 pt-8 border-t border-stone-200/60">
            {[
              { icon: '✨', text: 'Exclusive member-only rates' },
              { icon: '🔒', text: 'Secure & encrypted credentials' },
              { icon: '⚡', text: 'Instant booking confirmations' },
            ].map(perk => (
              <div key={perk.text} className="flex items-center gap-3">
                <span className="text-sm">{perk.icon}</span>
                <span className="text-stone-400 text-xs font-medium">{perk.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                <UserPlus size={14} className="text-amber-600" />
              </div>
              <span className="text-[10px] font-bold text-amber-600/60 uppercase tracking-[0.3em]">New Account</span>
            </div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Create Account</h1>
            <p className="text-stone-400 text-sm">Fill in your details to get started.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-stone-100 rounded-3xl p-8 sm:p-10 shadow-sm">
            {/* Role Selector */}
            <div className="mb-8 p-1 bg-stone-50 border border-stone-100 rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => setRole('guest')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${
                  role === 'guest'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Sparkles size={12} />
                Guest
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${
                  role === 'staff'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Hotel size={12} />
                Staff
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">First Name</Label>
                  <Input name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} className={inputClass('firstName')} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">M.I.</Label>
                  <Input name="middleName" placeholder="A" value={formData.middleName} onChange={handleInputChange} className="bg-stone-50/50 border border-stone-200 text-stone-800 placeholder:text-stone-300 h-12 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all font-medium px-4" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">Last Name</Label>
                  <Input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} className={inputClass('lastName')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">Email Address</Label>
                <Input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className={inputClass('email')} />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">Password</Label>
                <div className="relative">
                  <Input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`${inputClass('password')} pr-14`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-amber-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-1">Confirm Password</Label>
                <Input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className={inputClass('confirmPassword')} />
              </div>

              {Object.values(errors).some(e => e) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">{Object.values(errors).filter(e => e).join('. ')}.</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 mt-2 text-xs uppercase tracking-widest flex items-center justify-center"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-stone-50">
              <p className="text-stone-400 font-medium text-xs">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
