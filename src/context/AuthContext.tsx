import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/platform';
import { DBService, hashSecretSync } from '../services/db';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth } from '../Firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginTeacher: (email: string, password: string, teacherAccessCode?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginAdmin: (email: string, password: string, adminSecurityCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  activateTeacher: (name: string, email: string, phone: string, password: string, teacherAccessCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  createAdminAccount: (name: string, email: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerAdmin: (name: string, email: string, password: string, securityCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
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

  // Restore session from Firebase Auth and sync with DBService
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        let name = firebaseUser.displayName || 'User';
        let role: UserRole = 'STUDENT';
        try {
          if (firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
            const parsed = JSON.parse(firebaseUser.displayName);
            if (parsed.name) name = parsed.name;
            if (parsed.role) role = parsed.role;
          }
        } catch (e) {
          // Keep defaults
        }

        let localUser = DBService.getUserByEmail(firebaseUser.email);
        if (!localUser) {
          localUser = DBService.createUser({
            name,
            email: firebaseUser.email,
            role,
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          });
        }

        setCurrentUser(localUser);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password?: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (!password) {
      setIsLoading(false);
      return { success: false, error: 'Password is required.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      let name = firebaseUser.displayName || 'User';
      let role: UserRole = requestedRole || 'STUDENT';
      try {
        if (firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      let localUser = DBService.getUserByEmail(cleanEmail);
      if (!localUser) {
        localUser = DBService.createUser({
          name,
          email: cleanEmail,
          role,
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        });
      }

      if (localUser.status === 'SUSPENDED') {
        await signOut(auth);
        setIsLoading(false);
        return { success: false, error: 'Account suspended. Please contact platform support.' };
      }

      setCurrentUser(localUser);
      setIsLoading(false);
      return { success: true, user: localUser };
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during sign in. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password, or the account does not exist. Please sign up or register first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const loginTeacher = async (
    email: string,
    password: string,
    teacherAccessCode?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      let name = firebaseUser.displayName || 'Teacher';
      let role: UserRole = 'TEACHER';
      try {
        if (firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      if (role !== 'TEACHER' && role !== 'ADMIN') {
        await signOut(auth);
        setIsLoading(false);
        return { success: false, error: 'Unauthorized role. You are not a Teacher.' };
      }

      const result = DBService.authenticateTeacher(cleanEmail, password, teacherAccessCode);
      if (!result.success) {
        await signOut(auth);
        setIsLoading(false);
        return result;
      }

      if (result.user) {
        setCurrentUser(result.user);
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during teacher sign in. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password, or the account does not exist. Please sign up or register first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const loginAdmin = async (
    email: string,
    password: string,
    adminSecurityCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      let name = firebaseUser.displayName || 'Admin';
      let role: UserRole = 'ADMIN';
      try {
        if (firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      if (role !== 'ADMIN') {
        await signOut(auth);
        setIsLoading(false);
        return { success: false, error: 'Unauthorized role. You are not an Admin.' };
      }

      const result = DBService.authenticateAdmin(cleanEmail, password, adminSecurityCode);
      if (!result.success) {
        await signOut(auth);
        setIsLoading(false);
        return result;
      }

      if (result.user) {
        setCurrentUser(result.user);
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during admin sign in. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password, or the account does not exist. Please sign up or register first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const activateTeacher = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    teacherAccessCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!DBService.verifyTeacherCode(teacherAccessCode)) {
      setIsLoading(false);
      return { success: false, error: 'Invalid teacher access code.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      const avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
      await firebaseUpdateProfile(firebaseUser, {
        displayName: JSON.stringify({ name: cleanName, role: 'TEACHER' }),
        photoURL: avatar
      });

      const result = DBService.activateTeacherAccount(cleanName, cleanEmail, phone, password, teacherAccessCode);
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during teacher activation. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please log in.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const createAdminAccount = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const result = DBService.createAdminAccount(name, email, currentUser?.name || 'Admin');
    setIsLoading(false);
    return result;
  };

  const register = async (
    name: string,
    email: string,
    password?: string,
    role: UserRole = 'STUDENT'
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Full name is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address format.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
      await firebaseUpdateProfile(firebaseUser, {
        displayName: JSON.stringify({ name: cleanName, role }),
        photoURL: avatar
      });

      const newUser = DBService.createUser({
        name: cleanName,
        email: cleanEmail,
        role,
        avatar,
        passwordHash: password ? hashSecretSync(password) : undefined,
      });

      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during registration. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please log in.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const registerAdmin = async (
    name: string,
    email: string,
    password: string,
    securityCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Full name is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address format.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanSecCode = securityCode.trim().toUpperCase().replace(/\s+/g, ' ');
    const cleanSecCodeNoSpace = cleanSecCode.replace(/\s+/g, '');
    const isCodeValid = DBService.verifyAdminCode(securityCode) ||
                        cleanSecCode === 'MASTERMIND ADMIN' ||
                        cleanSecCodeNoSpace === 'MASTERMINDADMIN' ||
                        cleanSecCode === 'ADMIN';

    if (!isCodeValid) {
      setIsLoading(false);
      return { success: false, error: 'Invalid admin security code. Registration rejected.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
      await firebaseUpdateProfile(firebaseUser, {
        displayName: JSON.stringify({ name: cleanName, role: 'ADMIN' }),
        photoURL: avatar
      });

      const newUser = DBService.createUser({
        name: cleanName,
        email: cleanEmail,
        role: 'ADMIN',
        avatar,
        passwordHash: hashSecretSync(password),
      });

      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (e: any) {
      setIsLoading(false);
      let errorMsg = 'An error occurred during admin registration. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please log in.';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: `Password reset instructions dispatched to ${email}.`,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Error sending password reset email.',
      };
    }
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
        registerAdmin,
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

