import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-transparent">
          <Outlet />
          <Toaster position="top-right" />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

