import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, UserRole } from '@/types';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert backend role to frontend role
function mapRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    VOTER: 'voter',
    CANDIDATE: 'candidate',
    ADMIN: 'admin',
  };
  return roleMap[role] || 'voter';
}

// Helper to convert frontend role to backend role
function mapRoleToBackend(role: UserRole): 'VOTER' | 'CANDIDATE' {
  const roleMap: Record<UserRole, 'VOTER' | 'CANDIDATE'> = {
    voter: 'VOTER',
    candidate: 'CANDIDATE',
    admin: 'VOTER', // Admin registration not allowed via frontend
  };
  return roleMap[role];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await authApi.login(phone, password);
      
      // Check if user role matches requested role
      const userRole = mapRole(response.user.role);
      if (userRole !== role && response.user.role !== 'ADMIN') {
        toast.error('Invalid role for this account');
        return false;
      }

      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: mapRole(response.user.role),
        isVerified: true, // If login succeeds, user is verified
      };

      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('authToken', response.token);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
  }): Promise<boolean> => {
    try {
      const role = data.role || 'voter';
      const backendRole = mapRoleToBackend(role);
      
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: backendRole,
      });

      toast.success('Registration successful! OTP sent to your phone.');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const verifyOtp = async (phone: string, code: string): Promise<boolean> => {
    try {
      await authApi.verifyOtp(phone, code);
      toast.success('Phone verified! Waiting for admin approval.');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, verifyOtp, isLoading }}>
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
