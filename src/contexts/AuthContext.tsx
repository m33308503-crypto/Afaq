import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { syncUserWithBackend } from '../lib/api';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapFirebaseAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية. يمكنك المحاولة مرة أخرى.';
    case 'auth/cancelled-popup-request':
      return 'تم إلغاء طلب تسجيل الدخول السابق. يرجى المحاولة مجدداً.';
    case 'auth/popup-blocked':
      return 'قام المتصفح بحظر النافذة المنبثقة لتسجيل الدخول. يرجى السماح بالنوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى.';
    case 'auth/network-request-failed':
      return 'تعذر الاتصال بالإنترنت. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.';
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب. يرجى التواصل مع إدارة المنصة.';
    case 'auth/unauthorized-domain':
      return 'هذا النطاق غير مصرح له بتسجيل الدخول حالياً.';
    default:
      if (error instanceof Error && error.message) {
        return 'حدث خطأ أثناء تسجيل الدخول بحساب جوجل. يرجى المحاولة مرة أخرى.';
      }
      return 'تعذر إتمام تسجيل الدخول بحساب جوجل. يرجى المحاولة مجدداً.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncFirebaseUser = useCallback(async (firebaseUser: FirebaseUser) => {
    const token = await firebaseUser.getIdToken();
    try {
      const syncedUser = await syncUserWithBackend(token);
      setUser({
        ...syncedUser,
        photoURL: firebaseUser.photoURL || undefined,
      });
    } catch (err) {
      console.error('Failed to sync user with backend:', err);
      // Fallback profile while keeping verified firebaseUser
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'مستخدم آفاق',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncFirebaseUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncFirebaseUser]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        await syncFirebaseUser(result.user);
      }
      return true;
    } catch (error) {
      setAuthError(mapFirebaseAuthError(error));
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [syncFirebaseUser]);

  const logout = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
    setUser(null);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        authError,
        clearAuthError,
        signInWithGoogle,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
