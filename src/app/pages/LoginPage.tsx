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

    if (result.success) {
      toast.success('Login successful!');
      
      // Redirect based on role
      if (email.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (email.includes('staff') || email.includes('manager')) {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-emerald-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-700">Inntera</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Main Login Card */}
          <Card className="border border-emerald-100 bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Alert */}
                {(error || authError) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error || authError}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 rounded-lg focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Link to="/" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 rounded-lg focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg mt-6"
                  disabled={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 text-xs font-medium">DEMO ACCOUNTS</span>
                </div>
              </div>

              {/* Demo Login Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full h-10 border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-900 rounded-lg justify-start transition text-sm"
                  onClick={() => quickLogin('admin@inntera.com', 'admin123', 'admin')}
                >
                  <span className="mr-3">👑</span>
                  <div className="text-left">
                    <div className="font-semibold">Admin</div>
                  </div>
                </Button>

                <Button
                  className="w-full h-10 border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-900 rounded-lg justify-start transition text-sm"
                  onClick={() => quickLogin('mike.davis@grandplaza.com', 'staff123', 'staff')}
                >
                  <span className="mr-3">👔</span>
                  <div className="text-left">
                    <div className="font-semibold">Staff</div>
                  </div>
                </Button>

                <Button
                  className="w-full h-10 border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-900 rounded-lg justify-start transition text-sm"
                  onClick={() => quickLogin('alice@example.com', 'password123', 'client')}
                >
                  <span className="mr-3">🏨</span>
                  <div className="text-left">
                    <div className="font-semibold">Guest</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition">
                Sign Up
              </Link>
            </p>
            <p className="text-gray-500 text-xs">
              <Link to="/" className="text-emerald-600 hover:text-emerald-700 transition">
                Terms & Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

