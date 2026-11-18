import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

export interface CancelRegistrationModalProps {
  isOpen: boolean;
  eventTitle: string;
  onClose: () => void;
  onConfirmCancel: () => Promise<void>;
}

export const CancelRegistrationModal: React.FC<CancelRegistrationModalProps> = ({
  isOpen,
  eventTitle,
  onClose,
  onConfirmCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirmCancel();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذر إلغاء التسجيل. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-[#123B5D]">
              إلغاء التسجيل في الفعالية
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-body mt-1 leading-relaxed">
              هل أنت متأكد من رغبتك في إلغاء تسجيلك في{' '}
              <strong className="text-slate-900">{eventTitle}</strong>؟ سيتم إتاحة مقعدك لشخص آخر.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>
            تراجع
          </Button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-2 font-ui font-semibold text-sm h-11 px-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
