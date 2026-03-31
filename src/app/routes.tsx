import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { ClientLayout } from './layouts/ClientLayout';

// Public pages
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { HomePage } from './pages/HomePage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHotels } from './pages/admin/AdminHotels';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminGuests } from './pages/admin/AdminGuests';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminRates } from './pages/admin/AdminRates';

// Staff pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffBookings } from './pages/staff/StaffBookings';
import { StaffRooms } from './pages/staff/StaffRooms';
import { StaffCheckin } from './pages/staff/StaffCheckin';

// Client pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientSearch } from './pages/client/ClientSearch';
import { ClientBookings } from './pages/client/ClientBookings';
import { ClientHotelDetail } from './pages/client/ClientHotelDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignUpPage },
      
      // Admin routes
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', Component: AdminDashboard },
          { path: 'hotels', Component: AdminHotels },
          { path: 'rooms', Component: AdminRooms },
          { path: 'bookings', Component: AdminBookings },
          { path: 'guests', Component: AdminGuests },
          { path: 'staff', Component: AdminStaff },
          { path: 'rates', Component: AdminRates },
        ],
      },

      // Staff routes
      {
        path: 'staff',
        Component: StaffLayout,
        children: [
          { index: true, element: <Navigate to="/staff/dashboard" replace /> },
          { path: 'dashboard', Component: StaffDashboard },
          { path: 'bookings', Component: StaffBookings },
          { path: 'rooms', Component: StaffRooms },
          { path: 'checkin', Component: StaffCheckin },
        ],
      },

      // Client routes
      {
        path: 'client',
        Component: ClientLayout,
        children: [
          { index: true, element: <Navigate to="/client/dashboard" replace /> },
          { path: 'dashboard', Component: ClientDashboard },
          { path: 'search', Component: ClientSearch },
          { path: 'bookings', Component: ClientBookings },
          { path: 'hotel/:hotelId', Component: ClientHotelDetail },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

