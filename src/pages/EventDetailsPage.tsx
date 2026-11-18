import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { EventItem } from '../types';
import { CATEGORIES } from '../data/mockEvents';
import { Button } from '../components/ui/Button';
import { CancelRegistrationModal } from '../components/CancelRegistrationModal';

export interface EventDetailsPageProps {
  event: EventItem | undefined;
  isRegistered: boolean;
  registrationId?: string;
  justRegistered?: boolean;
  onGoBack: () => void;
  onRegisterClick: (event: EventItem) => void;
  onCancelRegistration: (registrationId: string) => Promise<void>;
  onGoToMyRegistrations: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  isRegistered,
  registrationId,
  justRegistered = false,
  onGoBack,
  onRegisterClick,
  onCancelRegistration,
  onGoToMyRegistrations,
}) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // If event is not found (invalid id)
  if (!event) {
    return (
      <div className="py-20 bg-white min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-[#DC2626]" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-[#123B5D] mb-3">
            الفعالية غير موجودة
          </h1>
          <p className="text-sm text-slate-600 font-body mb-8 leading-relaxed">
            عذراً، لم نتمكن من العثور على الفعالية التي تبحث عنها. قد تكون أُزيلت
            أو أن الرابط الذي اتبعته غير صحيح.
          </p>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4 ml-1.5" />}
            onClick={onGoBack}
          >
            العودة إلى قائمة الفعاليات
          </Button>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES[event.category] || {
    label: event.category,
    key: event.category,
  };

  const getCoverGradient = () => {
    switch (event.category) {
      case 'workshop':
        return 'from-[#0E2F4A] via-[#123B5D] to-[#254B6A]';
      case 'course':
        return 'from-[#123B5D] via-[#254B6A] to-[#41627D]';
      case 'event':
      default:
        return 'from-[#0B253A] via-[#123B5D] to-[#168A88]';
    }
  };

  const handleConfirmCancel = async () => {
    if (!registrationId) return;
    await onCancelRegistration(registrationId);
    setCancelSuccess(true);
  };

  return (
    <div className="py-8 sm:py-12 pb-28 lg:pb-12 bg-white min-h-[calc(100vh-280px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-sm font-ui font-semibold text-[#123B5D] hover:text-[#254B6A] py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>العودة إلى قائمة الفعاليات</span>
          </button>

          <span className="hidden sm:inline-flex items-center text-xs font-ui font-semibold text-slate-500">
            <span>الفعاليات</span>
            <span className="mx-2">/</span>
            <span className="text-[#123B5D]">{categoryInfo.label}</span>
          </span>
        </div>

        {/* Success Feedback Banner */}
        {(justRegistered || cancelSuccess) && (
          <div
            role="status"
            className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-ui flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {justRegistered
                  ? 'تم تسجيلك في الفعالية بنجاح! مقعدك محجوز الآن.'
                  : 'تم إلغاء تسجيلك في هذه الفعالية بنجاح.'}
              </span>
            </div>
            {justRegistered && (
              <button
                type="button"
                onClick={onGoToMyRegistrations}
                className="text-xs font-bold text-[#123B5D] hover:text-[#20C5C2] underline self-start sm:self-auto cursor-pointer"
              >
                الذهاب إلى تسجيلاتي
              </button>
            )}
          </div>
        )}

        {/* Large Cover Image Section */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-sm mb-10">
          {event.coverImageUrl ? (
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getCoverGradient()} p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden`}
            >
              <svg
                className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 450"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M-100 350 Q 250 150 550 300 T 1100 220"
                  stroke="#20C5C2"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M-50 400 Q 300 200 650 350 T 1150 280"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="850" cy="120" r="70" stroke="#20C5C2" strokeWidth="1.5" />
              </svg>

              <div className="flex items-center justify-between z-10">
                <span className="bg-[#20C5C2] text-[#0B253A] font-ui font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-xs">
                  {categoryInfo.label}
                </span>

                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-ui">
                  فعالية مؤكدة بالفيوم
                </div>
              </div>

              <div className="z-10 mt-auto max-w-3xl">
                <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm font-ui mb-2">
                  <Building2 className="w-4 h-4 text-[#20C5C2]" />
                  <span>{event.organizer}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>
          )}
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Details Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#20C5C2] text-[#0B253A] font-ui font-bold text-xs px-3 py-1 rounded-full">
                  {categoryInfo.label}
                </span>
                <span className="text-xs font-ui text-slate-500">
                  تنظيم: <strong className="text-[#123B5D]">{event.organizer}</strong>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#123B5D] leading-snug">
                {event.title}
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-[#123B5D]">
                تفاصيل الفعالية
              </h3>
              <div className="text-slate-700 text-base font-body leading-relaxed whitespace-pre-line space-y-4">
                <p>{event.description}</p>
                <p>
                  تأتي هذه الفعالية ضمن سلسلة المبادرات والأنشطة الموجهة لشباب
                  محافظة الفيوم لتعزيز مهاراتهم الرقمية، العملية، والريادية.
                  يتضمن اللقاء جلسات تفاعلية وفرصاً حقيقية للتطبيق العملي
                  والتواصل مع المشاركين والمدربين.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F1F3F5] border border-[#DEE4E8] space-y-3">
              <h4 className="text-sm font-ui font-bold text-[#123B5D] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C5C2]" />
                <span>إرشادات وتعليمات الحضور</span>
              </h4>
              <ul className="text-xs sm:text-sm text-slate-600 font-body space-y-2 list-disc list-inside">
                <li>الحضور متاح لجميع شباب محافظة الفيوم والمهتمين بالمجال.</li>
                <li>يُرجى الحضور قبل الموعد بـ 15 دقيقة لتأكيد الحضور واستلام الأدوات.</li>
                <li>في حال ورش العمل التقنية، يُفضل إحضار الكمبيوتر المحمول الشخصي.</li>
              </ul>
            </div>
          </div>

          {/* Sticky Sidebar / Information Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-heading font-bold text-[#123B5D] border-b border-slate-100 pb-3">
                بطاقة المعلومات والموعد
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-ui">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] text-[#123B5D] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">التاريخ</span>
                    <span className="font-semibold text-slate-900 block">
                      {event.dateLabel}
                    </span>
                  </div>
                </div>

                {event.timeLabel && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] text-[#123B5D] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">الوقت والتوقيت</span>
                      <span className="font-semibold text-slate-900 block">
                        {event.timeLabel}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EDFAFA] text-[#20C5C2] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">المكان في الفيوم</span>
                    <span className="font-semibold text-slate-900 block">
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] text-[#41627D] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">الجهة المنظمة</span>
                    <span className="font-semibold text-slate-900 block">
                      {event.organizer}
                    </span>
                  </div>
                </div>

                {event.seatsTotal && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">المقاعد المتاحة</span>
                      <span className="font-semibold text-slate-900 block">
                        متبقي {Math.max(0, event.seatsTotal - (event.seatsTaken || 0))} مقعد من أصل {event.seatsTotal}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Register / Already Registered Action Area */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {isRegistered ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      disabled
                      className="w-full text-center justify-center text-base font-bold bg-emerald-600 hover:bg-emerald-600 disabled:opacity-85"
                    >
                      أنت مسجّل بالفعل
                    </Button>
                    <p className="text-xs font-ui text-emerald-700 text-center">
                      تم تأكيد تسجيلك مسبقاً في هذه الفعالية ولا يمكن التسجيل مرتين.
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={onGoToMyRegistrations}
                        className="text-xs font-ui font-bold text-[#123B5D] hover:text-[#20C5C2] underline cursor-pointer"
                      >
                        عرض تسجيلاتي
                      </button>
                      {registrationId && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-ui font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>إلغاء التسجيل</span>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-center justify-center text-base font-bold shadow-md hover:shadow-[#123B5D]/20"
                    showArrow
                    onClick={() => {
                      setCancelSuccess(false);
                      onRegisterClick(event);
                    }}
                  >
                    سجّل الآن
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-ui text-slate-400 block">الموعد</span>
          <span className="text-xs font-ui font-bold text-[#123B5D]">
            {event.dateLabel}
          </span>
        </div>
        {isRegistered ? (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              disabled
              className="px-4 font-bold text-xs bg-emerald-600 disabled:opacity-85"
            >
              أنت مسجّل بالفعل
            </Button>
            {registrationId && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                aria-label="إلغاء التسجيل"
                title="إلغاء التسجيل"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="px-6 font-bold"
            showArrow
            onClick={() => {
              setCancelSuccess(false);
              onRegisterClick(event);
            }}
          >
            سجّل الآن
          </Button>
        )}
      </div>

      {/* Cancel Registration Modal */}
      <CancelRegistrationModal
        isOpen={cancelModalOpen}
        eventTitle={event.title}
        onClose={() => setCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
