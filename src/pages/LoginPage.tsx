import React, { useEffect } from 'react';
import { ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AfaqLogo } from '../components/AfaqLogo';
import { useAuth } from '../contexts/AuthContext';

export interface LoginPageProps {
  returnTo: string;
  onLoginSuccess: (redirectPath: string) => void;
  onGoBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  returnTo,
  onLoginSuccess,
  onGoBack,
}) => {
  const { user, loading, authLoading, authError, clearAuthError, signInWithGoogle } = useAuth();

  // If user is already logged in, redirect immediately back to target page
  useEffect(() => {
    if (!loading && user) {
      onLoginSuccess(returnTo || '/');
    }
  }, [user, loading, returnTo, onLoginSuccess]);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleGoogleLogin = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      onLoginSuccess(returnTo || '/');
    }
  };

  const isFromEvent = returnTo.startsWith('/events/');
  const isFromRegistrations = returnTo.startsWith('/my-registrations');

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-220px)] flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        {/* Top Back Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-sm font-ui font-semibold text-[#123B5D] hover:text-[#254B6A] py-1.5 px-3 rounded-full hover:bg-slate-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>رجوع</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-6">
            <AfaqLogo size="lg" />
          </div>

          <h1 className="text-2xl font-heading font-extrabold text-[#123B5D] mb-2">
            تسجيل الدخول إلى آفاق
          </h1>

          <p className="text-sm text-slate-600 font-body leading-relaxed mb-6">
            {isFromEvent
              ? 'سجّل دخولك بحساب جوجل لإكمال التسجيل في الفعالية وحجز مقعدك.'
              : isFromRegistrations
              ? 'يرجى تسجيل الدخول بحساب جوجل لعرض وإدارة تسجيلاتك.'
              : 'سجّل دخولك بحساب جوجل لحجز مقعدك في ورش وفعاليات الفيوم ومتابعة تسجيلاتك.'}
          </p>

          {/* Arabic Error Alert */}
          {authError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-ui text-right flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            disabled={authLoading || loading}
            onClick={handleGoogleLogin}
            className="w-full h-12 px-5 rounded-full border-2 border-[#123B5D]/20 hover:border-[#123B5D] bg-white hover:bg-[#F1F3F5] font-ui font-bold text-[#123B5D] text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] focus-visible:ring-offset-2"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#20C5C2]" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>الدخول بحساب جوجل</span>
              </>
            )}
          </button>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-ui text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#20C5C2] shrink-0" />
            <span>دخول آمن ومباشر بحساب جوجل بدون كلمات مرور</span>
          </div>
        </div>
      </div>
    </div>
  );
};
