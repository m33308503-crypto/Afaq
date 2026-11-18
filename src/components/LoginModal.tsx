import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { AfaqLogo } from './AfaqLogo';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (userName: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulate quick Google authentication handshake
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccessLogin?.('أحمد محمود (تجريبي)');
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150 text-center"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-5">
          <AfaqLogo size="md" />
        </div>

        <h3 className="text-xl font-heading font-bold text-[#123B5D] mb-2">
          تسجيل الدخول إلى آفاق
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-body mb-6 leading-relaxed">
          سجّل بحساب جوجل لتتمكن من حجز مقعدك في ورش وفعاليات الفيوم ومتابعة تسجيلاتك.
        </p>

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-ui flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>تم تسجيل الدخول بنجاح! مرحباً بك.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full h-12 px-4 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 font-ui font-semibold text-slate-700 text-sm flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#20C5C2]"
            >
              {/* Google G logo svg */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{loading ? 'جاري الاتصال بجوجل...' : 'المتابعة باستخدام حساب Google'}</span>
            </button>

            <div className="flex items-center gap-2 justify-center text-[11px] font-ui text-slate-400 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C5C2]" />
              <span>دخول آمن — لا نشارك بياناتك مع أي طرف خارجي</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
