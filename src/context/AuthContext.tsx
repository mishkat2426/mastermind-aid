import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/platform';
import { DBService } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginTeacher: (email: string, password: string, teacherAccessCode?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginAdmin: (email: string, password: string, adminSecurityCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  activateTeacher: (name: string, email: string, phone: string, password: string, teacherAccessCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  createAdminAccount: (name: string, email: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, role: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<User>) => void;
}

const AUTH_SESSION_KEY = 'mastermind_auth_session_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const savedUserRaw = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedUserRaw) {
        const savedUser: User = JSON.parse(savedUserRaw);
        const freshUser = DBService.getUserById(savedUser.id);
        if (freshUser) {
          setCurrentUser(freshUser);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    let user = DBService.getUserByEmail(email);

    if (!user) {
      user = DBService.createUser({
        name: email.split('@')[0],
        email,
        role: requestedRole || 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      });
    }

    if (user.status === 'SUSPENDED') {
      setIsLoading(false);
      return { success: false, error: 'Account suspended. Please contact platform support.' };
    }

    setCurrentUser(user);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    setIsLoading(false);
    return { success: true, user };
  };

  const loginTeacher = async (
    email: string,
    password: string,
    teacherAccessCode?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const result = DBService.authenticateTeacher(email, password, teacherAccessCode);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  };

  const loginAdmin = async (
    email: string,
    password: string,
    adminSecurityCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const result = DBService.authenticateAdmin(email, password, adminSecurityCode);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  };

  const activateTeacher = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    teacherAccessCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const result = DBService.activateTeacherAccount(name, email, phone, password, teacherAccessCode);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  };

  const createAdminAccount = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const result = DBService.createAdminAccount(name, email, currentUser?.name || 'Admin');
    setIsLoading(false);
    return result;
  };

  const register = async (
    name: string,
    email: string,
    role: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const existing = DBService.getUserByEmail(email);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = DBService.createUser({
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    setCurrentUser(newUser);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 400));
    return {
      success: true,
      message: `Password reset instructions dispatched to ${email}.`,
    };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 400));
    return {
      success: true,
      message: 'Your password has been successfully updated. You can now log in.',
    };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = DBService.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        loginTeacher,
        loginAdmin,
        activateTeacher,
        createAdminAccount,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
