import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // Simulate successful login
    const mockUser = {
      id: '1',
      email: email,
      user_metadata: { full_name: 'Test User' }
    } as User;
    
    setUser(mockUser);
    setIsAuthenticated(true);
    toast.success('Successfully signed in!');
  };

  const register = async (email: string, password: string, fullName: string) => {
    // Simulate successful registration
    const mockUser = {
      id: '1',
      email: email,
      user_metadata: { full_name: fullName }
    } as User;
    
    setUser(mockUser);
    setIsAuthenticated(true);
    toast.success('Successfully registered!');
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};