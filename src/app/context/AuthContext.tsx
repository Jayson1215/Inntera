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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('hotel_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, error }}>
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

