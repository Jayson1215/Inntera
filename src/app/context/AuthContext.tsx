import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { adminUser, staffUser, guests } from '../data/mockData';

type UserRole = 'admin' | 'staff' | 'guest' | null;

interface User {
  email: string;
  role: UserRole;
  id?: number;
  name?: string;
  hotel_id?: number;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hotel_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!email || !password) {
        const err = 'Email and password are required';
        setError(err);
        return { success: false, error: err };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check admin
      if (email === adminUser.email && password === adminUser.password) {
        const userData: User = { 
          email, 
          role: 'admin', 
          name: 'Admin User',
          hotel_id: 1
        };
        setUser(userData);
        localStorage.setItem('hotel_user', JSON.stringify(userData));
        return { success: true };
      }

      // Check staff
      if (email === staffUser.email && password === staffUser.password) {
        const userData: User = { 
          email, 
          role: 'staff', 
          id: staffUser.staff_id,
          name: 'Mike Davis',
          hotel_id: 1 // Default hotel for staff
        };
        setUser(userData);
        localStorage.setItem('hotel_user', JSON.stringify(userData));
        return { success: true };
      }

      // Check guests
      const guest = guests.find(g => g.email === email && g.password === password);
      if (guest) {
        const userData: User = { 
          email, 
          role: 'guest', 
          id: guest.guest_id,
          name: `${guest.first_name} ${guest.last_name}`
        };
        setUser(userData);
        localStorage.setItem('hotel_user', JSON.stringify(userData));
        return { success: true };
      }

      const err = 'Invalid email or password';
      setError(err);
      return { success: false, error: err };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!data.firstName || !data.lastName || !data.email || !data.password) {
        const err = 'All fields are required';
        setError(err);
        return { success: false, error: err };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        const err = 'Invalid email format';
        setError(err);
        return { success: false, error: err };
      }

      // Validate password length
      if (data.password.length < 6) {
        const err = 'Password must be at least 6 characters';
        setError(err);
        return { success: false, error: err };
      }

      // Check if email already exists
      if (guests.some(g => g.email === data.email)) {
        const err = 'Email already registered';
        setError(err);
        return { success: false, error: err };
      }

      // Check if admin or staff email
      if (data.email === adminUser.email || data.email === staffUser.email) {
        const err = 'This email is already in use';
        setError(err);
        return { success: false, error: err };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new guest
      const newGuestId = Math.max(...guests.map(g => g.guest_id), 0) + 1;
      const newGuest: any = {
        guest_id: newGuestId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: '',
        address: '',
        password: data.password,
        created_at: new Date().toISOString()
      };

      // Add to guests array (simulating database insertion)
      guests.push(newGuest);

      // Log the user in
      const userData: User = {
        email: data.email,
        role: 'guest',
        id: newGuestId,
        name: `${data.firstName} ${data.lastName}`
      };
      setUser(userData);
      localStorage.setItem('hotel_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('hotel_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

