// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

export interface User {
  id: string; name: string; email: string;
  city: string; state: string; bio: string;
  avatar_color: string; preferred_lang: string;
  is_verified: boolean; created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('sakhi_token');
      if (stored) {
        try {
          const res = await authApi.getMe();
          setUser(res.data.data.user);
          setToken(stored);
        } catch {
          localStorage.removeItem('sakhi_token');
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('sakhi_token', token);
    setUser(user); setToken(token);
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    const { user, token } = res.data.data;
    localStorage.setItem('sakhi_token', token);
    setUser(user); setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('sakhi_token');
    setUser(null); setToken(null);
  };

  const updateUser = (data: Partial<User>) => setUser(u => u ? { ...u, ...data } : null);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
