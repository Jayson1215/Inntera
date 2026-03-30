import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

