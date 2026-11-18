import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface UnauthorizedPageProps {
  isLoggedIn: boolean;
  onGoHome: () => void;
  onGoToLogin: () => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  isLoggedIn,
  onGoHome,
  onGoToLogin,
}) => {
  return (
    <div className="py-20 bg-white min-h-[calc(100vh-280px)] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" strokeWidth={1.75} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#123B5D] mb-3">
          غير مصرّح
        </h1>

        <p className="text-sm text-slate-600 font-body mb-8 leading-relaxed">
          {isLoggedIn
            ? 'عذراً، لا تملك صلاحية الوصول إلى لوحة التحكم. هذه المنطقة مخصصة لمسؤولي منصة آفاق فقط.'
            : 'عذراً، هذه الصفحة محمية ومخصصة لمسؤولي المنصة فقط. يرجى تسجيل الدخول بحساب مصرّح له.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onGoHome}
            className="w-full sm:w-auto justify-center"
          >
            العودة للرئيسية
          </Button>

          {!isLoggedIn && (
            <Button
              variant="outline"
              size="md"
              onClick={onGoToLogin}
              className="w-full sm:w-auto justify-center"
            >
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
