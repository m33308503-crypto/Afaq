import React from 'react';
import { X, Calendar, MapPin, Building2, Users, Clock, ArrowLeft } from 'lucide-react';
import { EventItem } from '../types';
import { CATEGORIES } from '../data/mockEvents';
import { Button } from './ui/Button';

export interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegisterClick: (event: EventItem) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onRegisterClick,
}) => {
  if (!event) return null;

  const categoryInfo = CATEGORIES[event.category] || {
    label: event.category,
    key: event.category,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header / Banner */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full bg-gradient-to-r from-[#0E2F4A] via-[#123B5D] to-[#254B6A] p-6 flex flex-col justify-between text-white overflow-hidden">
          {/* Subtle decor line */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#20C5C2_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="flex items-center justify-between z-10">
            <span className="bg-[#20C5C2] text-[#0B253A] font-ui font-bold text-xs px-3.5 py-1 rounded-full shadow-xs">
              {categoryInfo.label}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#20C5C2]"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="z-10 mt-auto">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white line-clamp-2">
              {event.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/80 font-ui mt-1">
              <Building2 className="w-3.5 h-3.5 text-[#20C5C2]" />
              <span>{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Fast Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-ui text-slate-700">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#123B5D] shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">التاريخ</span>
                <span className="font-semibold text-slate-900">{event.dateLabel}</span>
              </div>
            </div>

            {event.timeLabel && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#123B5D] shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">التوقيت</span>
                  <span className="font-semibold text-slate-900">{event.timeLabel}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-[#20C5C2] shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">المكان في الفيوم</span>
                <span className="font-semibold text-slate-900">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#123B5D] mb-2">
              عن الفعالية
            </h4>
            <p className="text-sm text-slate-600 font-body leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Notice */}
          <div className="p-3.5 rounded-xl bg-[#EDFAFA] border border-[#B3EBEA] text-xs font-ui text-[#0E2F4A] flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#20C5C2] shrink-0" />
            <span>
              التسجيل مفتوح للشباب بمحافظة الفيوم. المقاعد محدودة وتُمنح بأولوية التسجيل.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            إغلاق
          </Button>

          <Button
            variant="secondary"
            size="md"
            showArrow
            onClick={() => onRegisterClick(event)}
            className="font-bold px-6"
          >
            التسجيل في الفعالية
          </Button>
        </div>
      </div>
    </div>
  );
};
