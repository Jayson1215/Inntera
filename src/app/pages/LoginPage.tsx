import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    
    const result = await login(userEmail, userPassword);
    if (result.success) {
      toast.success('Login successful!');
      if (userEmail.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (userEmail.includes('staff') || userEmail.includes('manager')) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Hotel className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-semibold text-gray-900">HotelBook</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || authError) && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error || authError}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Login */}
          <Card className="shadow-xl bg-gray-50">
            <CardHeader>
              <CardTitle>Quick Demo Login</CardTitle>
              <CardDescription>Click to login with demo credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-white hover:bg-blue-50"
                onClick={() => quickLogin('admin@hotelbook.com', 'admin123')}
              >
                <div className="text-left">
                  <div className="font-semibold">Admin Portal</div>
                  <div className="text-xs text-gray-500">Full system access</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-white hover:bg-green-50"
                onClick={() => quickLogin('mike.davis@grandplaza.com', 'staff123')}
              >
                <div className="text-left">
                  <div className="font-semibold">Staff Portal</div>
                  <div className="text-xs text-gray-500">Front desk operations</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-white hover:bg-purple-50"
                onClick={() => quickLogin('alice@example.com', 'password123')}
              >
                <div className="text-left">
                  <div className="font-semibold">Guest Portal</div>
                  <div className="text-xs text-gray-500">Book and manage reservations</div>
                </div>
              </Button>

              <div className="pt-4 border-t mt-4">
                <p className="text-xs text-gray-500 text-center">
                  Click any option above for instant access to demo accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

