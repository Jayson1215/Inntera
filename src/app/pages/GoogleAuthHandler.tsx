import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function GoogleAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeSocialLogin } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const dataParam = searchParams.get('data');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        toast.error(decodeURIComponent(errorParam));
        navigate('/login');
        return;
      }

      if (!dataParam) {
        toast.error('Authentication data missing');
        navigate('/login');
        return;
      }

      try {
        // Decode the base64 data from the backend
        const decodedData = JSON.parse(atob(dataParam));
        
        // Complete the login in context
        completeSocialLogin(decodedData);
        
        toast.success('Social login successful!');

        // Navigate based on role
        if (decodedData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (decodedData.role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        toast.error('Failed to complete social login');
        navigate('/login');
      }
    };

    handleAuth();
  }, [location, navigate, completeSocialLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-black text-sky-800 uppercase tracking-widest">Authenticating...</h2>
        <p className="text-slate-500 mt-2">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}
