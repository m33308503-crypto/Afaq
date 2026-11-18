import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { RegistrationWithEvent, EventItem } from '../types';
import { CATEGORIES } from '../data/mockEvents';
import { Button } from '../components/ui/Button';
import { CancelRegistrationModal } from '../components/CancelRegistrationModal';

export interface MyRegistrationsPageProps {
  registrations: RegistrationWithEvent[];
  loading: boolean;
  error: string | null;
  onSelectEvent: (event: EventItem) => void;
  onBrowseEvents: () => void;
  onGoBack: () => void;
  onCancelRegistration: (registrationId: string) => Promise<void>;
}

export const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({
  registrations,
  loading,
  error,
  onSelectEvent,
  onBrowseEvents,
  onGoBack,
  onCancelRegistration,
}) => {
  const [targetToCancel, setTargetToCancel] = useState<RegistrationWithEvent | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const handleConfirmCancel = async () => {
    if (!targetToCancel) return;
    const cancelledTitle = targetToCancel.event.title;
    await onCancelRegistration(targetToCancel.id);
    setCancelSuccessMsg(`تم إلغاء تسجيلك في «${cancelledTitle}» بنجاح.`);
  };

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[calc(100vh-280px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-sm font-ui font-semibold text-[#123B5D] hover:text-[#254B6A] py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>رجوع</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#123B5D]">
              تسجيلاتي
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 font-body">
              قائمة الفعاليات والورش والدورات التي قمت بالتسجيل فيها، مرتبة حسب الأقرب موعداً
            </p>
          </div>

          {!loading && registrations.length > 0 && (
            <div className="text-xs font-ui font-semibold text-[#123B5D] bg-[#EDFAFA] border border-[#B3EBEA] px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              إجمالي التسجيلات: <strong className="font-bold">{registrations.length}</strong>
            </div>
          )}
        </div>

        {/* Success Notice after cancellation */}
        {cancelSuccessMsg && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-ui flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setCancelSuccessMsg(null)}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-ui flex items-center gap-2.5"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#20C5C2]" />
            <span className="text-sm font-ui">جاري تحميل تسجيلاتك...</span>
          </div>
        ) : registrations.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center max-w-lg mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-[#EDFAFA] border border-[#B3EBEA] text-[#20C5C2] flex items-center justify-center mx-auto mb-5">
              <Ticket className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading font-bold text-xl text-[#123B5D] mb-2">
              لم تسجّل في أي فعالية بعد
            </h2>
            <p className="text-sm text-slate-600 font-body mb-7 leading-relaxed">
              تصفح أحدث ورش العمل والدورات والفعاليات المقامة في الفيوم واختر ما يناسب اهتماماتك للتسجيل.
            </p>
            <Button
              variant="primary"
              size="md"
              showArrow
              onClick={onBrowseEvents}
            >
              تصفح الفعاليات
            </Button>
          </div>
        ) : (
          /* Nearest-first sorted registrations list */
          <div className="space-y-4">
            {registrations.map((reg) => {
              const ev = reg.event;
              const categoryLabel = CATEGORIES[ev.category]?.label || ev.category;

              return (
                <article
                  key={reg.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-ui">
                      <span className="bg-[#20C5C2] text-[#0B253A] font-bold px-3 py-0.5 rounded-full">
                        {categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مؤكد</span>
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{ev.organizer}</span>
                      </span>
                    </div>

                    <h2
                      onClick={() => onSelectEvent(ev)}
                      className="text-lg sm:text-xl font-heading font-bold text-[#123B5D] hover:text-[#254B6A] cursor-pointer transition-colors"
                    >
                      {ev.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-ui text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#123B5D] shrink-0" />
                        <span className="font-semibold text-slate-800">{ev.dateLabel}</span>
                      </div>
                      {ev.timeLabel && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#41627D] shrink-0" />
                          <span>{ev.timeLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#20C5C2] shrink-0" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      showArrow
                      onClick={() => onSelectEvent(ev)}
                    >
                      التفاصيل
                    </Button>

                    <button
                      type="button"
                      onClick={() => setTargetToCancel(reg)}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full text-xs font-ui font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إلغاء التسجيل</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Registration Confirmation Modal */}
      <CancelRegistrationModal
        isOpen={Boolean(targetToCancel)}
        eventTitle={targetToCancel?.event.title || ''}
        onClose={() => setTargetToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
