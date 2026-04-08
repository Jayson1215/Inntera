import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { authService } from '../lib/api';

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
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role: 'guest' | 'staff';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; user?: User; error?: string }>;
  completeSocialLogin: (userData: User) => void;
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        const err = 'Email and password are required';
        setError(err);
        return { success: false, error: err };
      }

      const response = await authService.login(email, password);

      if (response.success && response.data) {
        const userData: User = {
          email: response.data.email,
          role: response.data.role,
          id: response.data.id,
          name: response.data.name,
          hotel_id: response.data.hotel_id ?? undefined,
        };
        setUser(userData);
        localStorage.setItem('hotel_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      const err = response.error || 'Invalid email or password';
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

  const signup = useCallback(async (data: SignUpData): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.firstName || !data.lastName || !data.email || !data.password) {
        const err = 'All fields are required';
        setError(err);
        return { success: false, error: err };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        const err = 'Invalid email format';
        setError(err);
        return { success: false, error: err };
      }

      if (data.password.length < 6) {
        const err = 'Password must be at least 6 characters';
        setError(err);
        return { success: false, error: err };
      }

      const response = await authService.signup({
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (response.success && response.data) {
        const userData: User = {
          email: response.data.email,
          role: response.data.role,
          id: response.data.id,
          name: response.data.name,
          hotel_id: response.data.hotel_id ?? undefined,
        };
        setUser(userData);
        localStorage.setItem('hotel_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      const err = response.error || 'Signup failed';
      setError(err);
      return { success: false, error: err };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeSocialLogin = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('hotel_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('hotel_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, completeSocialLogin, logout, isAuthenticated: !!user, isLoading, error }}>
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
