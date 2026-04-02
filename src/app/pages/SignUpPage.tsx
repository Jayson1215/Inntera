import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle, Hotel } from 'lucide-react';
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
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
    
    if (!validateForm()) {
      return;
    }

    const result = await signup({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      toast.success('Account created successfully! Welcome to Inntera');
      navigate('/client/dashboard');
    } else {
      toast.error(result.error || 'Failed to create account');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex flex-col font-sans">
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
            <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-wide italic uppercase">Create Account</h1>
            <p className="text-slate-500 font-bold tracking-[0.05em] text-xs uppercase">Join Inntera today and start booking your dream hotels</p>
          </div>

          {/* Sign Up Card */}
          <Card className="border-2 border-sky-100 !bg-white shadow-2xl shadow-sky-200/20 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 sm:p-12 !bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-black font-semibold ml-1">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`bg-white border-2 ${errors.firstName ? 'border-red-500' : 'border-slate-100'} text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5`}
                    />
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-black font-semibold ml-1">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      type="text"
                      placeholder="Optional"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className={`bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5`}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-black font-semibold ml-1">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`bg-white border-2 ${errors.lastName ? 'border-red-500' : 'border-slate-100'} text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-semibold ml-1">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`bg-white border-2 ${errors.email ? 'border-red-500' : 'border-slate-100'} text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5`}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black font-semibold ml-1">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`bg-white border-2 ${errors.password ? 'border-red-500' : 'border-slate-100'} text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5 pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors text-sm font-bold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black font-semibold ml-1">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`bg-white border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-100'} text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-sky-100 transition-all font-bold px-5`}
                  />
                </div>

                {/* Error Summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 font-medium">Please fix the errors above to continue.</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-black rounded-xl transition-all shadow-lg shadow-sky-100 mt-6 text-sm uppercase tracking-widest"
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center border-t border-slate-100 pt-8">
                <p className="text-slate-500 font-medium text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-sky-600 hover:text-sky-700 font-bold text-sm">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <div className="mt-8 p-6 bg-white rounded-[1.5rem] border-2 border-sky-50 shadow-sm text-center">
            <p className="text-xs text-slate-500 font-bold tracking-tight">
              <span className="uppercase text-sky-600 mr-2">Demo Access:</span>
              admin@inntera.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
