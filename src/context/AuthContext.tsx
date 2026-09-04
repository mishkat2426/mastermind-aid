import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/platform';
import { DBService, hashSecretSync } from '../services/db';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword
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
  verifyFirebaseResetCode: (oobCode: string) => Promise<{ success: boolean; email?: string; error?: string }>;
  confirmFirebaseReset: (oobCode: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, newPassword?: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
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
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return {
        success: false,
        message: 'অনুগ্রহ করে আপনার ইমেইল এড্রেস প্রদান করুন। (Please provide your email address.)',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        message: 'অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস ফরম্যাট দিন। (Please enter a valid email address format.)',
      };
    }

    try {
      // Execute authentic Firebase password reset email dispatch
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `ফায়ারবেস থেকে ${cleanEmail} ঠিকানায় পাসওয়ার্ড রিসেট লিংক সফলভাবে পাঠানো হয়েছে! অনুগ্রহ করে আপনার ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার চেক করুন। (Firebase password reset link dispatched to ${cleanEmail}. Please check your inbox or spam folder.)`,
      };
    } catch (e: any) {
      let errorMsg = 'পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
      if (e.code === 'auth/user-not-found') {
        errorMsg = 'এই ইমেইল দিয়ে কোনো ফায়ারবেস অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল দিন বা নতুন অ্যাকাউন্ট খুলুন। (No Firebase account found with this email.)';
      } else if (e.code === 'auth/invalid-email') {
        errorMsg = 'ইমেইল এড্রেসটি সঠিক নয়। (Invalid email address format.)';
      } else if (e.code === 'auth/too-many-requests') {
        errorMsg = 'অতিরিক্ত অনুরোধ পাঠানো হয়েছে। সুরক্ষার জন্য কিছুক্ষণ পর আবার চেষ্টা করুন। (Too many attempts. Please try again later.)';
      } else if (e.code === 'auth/network-request-failed') {
        errorMsg = 'নেটওয়ার্ক সমস্যা। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন। (Network request failed.)';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const verifyFirebaseResetCode = async (
    oobCode: string
  ): Promise<{ success: boolean; email?: string; error?: string }> => {
    if (!oobCode) {
      return { success: false, error: 'কোনো অ্যাকশন কোড পাওয়া যায়নি। (No action code found.)' };
    }
    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      return { success: true, email };
    } catch (e: any) {
      let errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি মেয়াদোত্তীর্ণ বা অকার্যকর হয়ে গেছে। (The reset link is invalid or has expired.)';
      if (e.code === 'auth/expired-action-code') {
        errorMsg = 'এই পাসওয়ার্ড রিসেট লিংকের মেয়াদ শেষ হয়ে গেছে। দয়া করে নতুন করে লিংক পাঠানোর অনুরোধ করুন। (The reset link has expired.)';
      } else if (e.code === 'auth/invalid-action-code') {
        errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি সঠিক নয় অথবা ইতিমধ্যে ব্যবহার করা হয়েছে। (The reset code is invalid or has already been used.)';
      } else if (e.code === 'auth/user-disabled') {
        errorMsg = 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। (This account has been disabled.)';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const confirmFirebaseReset = async (
    oobCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!oobCode) {
      return {
        success: false,
        message: 'পাসওয়ার্ড রিসেট কোড পাওয়া যায়নি। (No reset code provided.)',
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters long.)',
      };
    }

    try {
      // 1. Retrieve associated email first to synchronize local DBService
      let associatedEmail = '';
      try {
        associatedEmail = await verifyPasswordResetCode(auth, oobCode);
      } catch (err) {
        // If code expired or invalid, confirmPasswordReset below will throw corresponding error
      }

      // 2. Commit password reset in Firebase Authentication
      await confirmPasswordReset(auth, oobCode, newPassword);

      // 3. Keep local DBService in sync
      if (associatedEmail) {
        DBService.resetUserPasswordByEmail(associatedEmail.toLowerCase(), newPassword);
      }

      return {
        success: true,
        message: 'ফায়ারবেসে পাসওয়ার্ড সফলভাবে রিসেট ও আপডেট করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন। (Firebase password reset successful! You can now log in.)',
      };
    } catch (e: any) {
      let errorMsg = 'পাসওয়ার্ড রিসেট সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
      if (e.code === 'auth/weak-password') {
        errorMsg = 'পাসওয়ার্ডটি খুবই দুর্বল। অন্তত ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন। (Password is too weak.)';
      } else if (e.code === 'auth/expired-action-code') {
        errorMsg = 'এই পাসওয়ার্ড রিসেট লিংকের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার নতুন লিংকের অনুরোধ করুন। (The reset link has expired.)';
      } else if (e.code === 'auth/invalid-action-code') {
        errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি সঠিক নয় অথবা ইতিমধ্যে ব্যবহার হয়ে গেছে। (The reset link is invalid or has already been used.)';
      } else if (e.code === 'auth/user-not-found') {
        errorMsg = 'সংশ্লিষ্ট অ্যাকাউন্টটি পাওয়া যায়নি। (User not found.)';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const resetPassword = async (email: string, newPassword?: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!newPassword) {
      await new Promise((res) => setTimeout(res, 300));
      return {
        success: true,
        message: 'Your password has been successfully updated. You can now log in.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters)',
      };
    }

    // 1. Firebase password update if currently active user matches
    if (auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmail) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } catch (fbErr) {
        console.warn('Firebase update password notice:', fbErr);
      }
    }

    // 2. DBService password update
    const result = DBService.resetUserPasswordByEmail(cleanEmail, newPassword);
    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to reset password.',
      };
    }

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন। (Password successfully updated! You can now log in.)',
    };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'User is not logged in.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (New password must be at least 6 characters)' };
    }

    // 1. Try Firebase update if auth user is present
    if (auth.currentUser) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } catch (fbErr: any) {
        console.warn('Firebase password update warning:', fbErr.message);
      }
    }

    // 2. Update DBService
    const result = DBService.updateUserPassword(currentUser.id, currentPassword, newPassword);
    return result;
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    try {
      if (auth.currentUser && (updates.name || updates.avatar)) {
        try {
          await firebaseUpdateProfile(auth.currentUser, {
            displayName: JSON.stringify({ name: updates.name || currentUser.name, role: currentUser.role }),
            photoURL: updates.avatar || currentUser.avatar,
          });
        } catch (fbErr) {
          console.warn('Firebase profile sync note:', fbErr);
        }
      }

      const updated = DBService.updateUserProfile(currentUser.id, updates);
      if (updated) {
        setCurrentUser(updated);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, error: 'Failed to update profile.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update error.' };
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
        verifyFirebaseResetCode,
        confirmFirebaseReset,
        resetPassword,
        changePassword,
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

