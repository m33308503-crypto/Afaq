import React from 'react';
import { Calendar, MapPin, ArrowLeft, Building2, Sparkles, Award, Users } from 'lucide-react';
import { EventItem } from '../types';
import { CATEGORIES } from '../data/mockEvents';

export interface EventCardProps {
  event: EventItem;
  onSelect?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const categoryInfo = CATEGORIES[event.category] || {
    label: event.category,
    key: event.category,
  };

  // Distinct themed visual backdrops for Fayoum events
  const getThemedCover = () => {
    switch (event.category) {
      case 'workshop':
        return {
          gradient: 'from-[#0E2F4A] via-[#123B5D] to-[#254B6A]',
          accentBar: '#20C5C2',
          icon: <Sparkles className="w-8 h-8 text-[#20C5C2]/70" strokeWidth={1.5} />,
          badgeBg: 'bg-[#20C5C2] text-[#0B253A]',
        };
      case 'course':
        return {
          gradient: 'from-[#123B5D] via-[#254B6A] to-[#41627D]',
          accentBar: '#51D2CF',
          icon: <Award className="w-8 h-8 text-[#51D2CF]/70" strokeWidth={1.5} />,
          badgeBg: 'bg-[#20C5C2] text-[#0B253A]',
        };
      case 'event':
      default:
        return {
          gradient: 'from-[#0B253A] via-[#123B5D] to-[#168A88]',
          accentBar: '#20C5C2',
          icon: <Users className="w-8 h-8 text-[#20C5C2]/70" strokeWidth={1.5} />,
          badgeBg: 'bg-[#20C5C2] text-[#0B253A]',
        };
    }
  };

  const theme = getThemedCover();

  return (
    <article
      onClick={() => onSelect?.(event)}
      className="group flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:shadow-[#123B5D]/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* 16:9 Visual Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col justify-between p-5 relative overflow-hidden`}
          >
            {/* Subtle decorative geometry inspired by Fayoum lake ripples & desert contours */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 225"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M-50 180 Q 100 80 250 160 T 450 120"
                stroke="#20C5C2"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M-30 200 Q 120 110 270 190 T 470 150"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="340" cy="50" r="30" stroke="#20C5C2" strokeWidth="1" />
            </svg>

            <div className="flex items-center justify-between z-10 w-full">
              {/* Category Badge on top of image with accent-500 */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-ui font-bold shadow-xs ${theme.badgeBg}`}
              >
                {categoryInfo.label}
              </span>

              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs text-white">
                {theme.icon}
              </div>
            </div>

            {/* Micro Tag at the bottom of the visual */}
            <div className="z-10 flex items-center justify-between text-white/80 text-xs font-ui">
              <span className="truncate max-w-[200px]">{event.organizer}</span>
              {event.seatsTotal && (
                <span className="bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] text-accent-200">
                  متبقي {event.seatsTotal - (event.seatsTaken || 0)} مقعد
                </span>
              )}
            </div>
          </div>
        )}

        {/* If image exists, category badge is placed here */}
        {event.coverImageUrl && (
          <span className="absolute top-3 right-3 bg-[#20C5C2] text-[#0B253A] font-ui font-bold text-xs px-3 py-1 rounded-full shadow-md z-10">
            {categoryInfo.label}
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="flex flex-col flex-1 p-5 gap-3.5">
        {/* Organizer info */}
        <div className="flex items-center gap-1.5 text-xs font-ui text-[#41627D]">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-[#20C5C2]" />
          <span className="truncate font-medium">{event.organizer}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-base text-[#123B5D] leading-snug line-clamp-2 group-hover:text-[#254B6A] transition-colors">
          {event.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 font-body line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Metadata Strip: Location & Date */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs font-ui text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0 text-[#20C5C2]" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 shrink-0 text-[#123B5D]" />
              <span className="font-medium">{event.dateLabel}</span>
            </div>

            {/* Details link with directional arrow */}
            <span className="inline-flex items-center gap-1 text-xs font-ui font-bold text-[#123B5D] group-hover:text-[#20C5C2] transition-colors">
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
