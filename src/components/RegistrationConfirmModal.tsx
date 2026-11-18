import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, MapPin, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { EventItem } from '../types';
import { Button } from './ui/Button';

export interface RegistrationConfirmModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRegister: (event: EventItem) => Promise<void>;
  onGoToMyRegistrations?: () => void;
}

export const RegistrationConfirmModal: React.FC<RegistrationConfirmModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirmRegister,
  onGoToMyRegistrations,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, event?.id]);

  if (!isOpen || !event) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirmRegister(event);
      setConfirmed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذر إتمام التسجيل. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmed ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#123B5D]">
              تم تأكيد تسجيلك بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed">
              تم حجز مقعدك في{' '}
              <strong className="text-slate-900 font-semibold">{event.title}</strong>.
              يمكنك متابعة جميع فعالياتك من صفحة تسجيلاتي.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs font-ui text-slate-700 text-right space-y-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#123B5D]" />
                <span>{event.dateLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#20C5C2]" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {onGoToMyRegistrations && (
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 justify-center"
                  showArrow
                  onClick={() => {
                    handleClose();
                    onGoToMyRegistrations();
                  }}
                >
                  عرض تسجيلاتي
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                className="flex-1 justify-center"
                onClick={handleClose}
              >
                إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-[#123B5D]">
              تأكيد التسجيل في الفعالية
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-body">
              أنت على وشك حجز مقعدك في الفعالية التالية:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-ui">
              <h4 className="font-heading font-bold text-sm text-[#123B5D]">
                {event.title}
              </h4>
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-[#41627D] shrink-0" />
                <span>{event.organizer}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-[#123B5D] shrink-0" />
                <span className="font-semibold">
                  {event.dateLabel} {event.timeLabel ? `(${event.timeLabel})` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#20C5C2] shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" size="md" onClick={handleClose} disabled={loading}>
                إلغاء
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={loading}
                onClick={handleConfirm}
                icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                showArrow={!loading}
              >
                {loading ? 'جاري التأكيد...' : 'تأكيد التسجيل'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
