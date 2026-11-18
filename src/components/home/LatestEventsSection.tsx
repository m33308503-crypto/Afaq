import React from 'react';
import { EventItem, EventCategory } from '../../types';
import { EventCard } from '../EventCard';
import { FilterChip } from '../ui/FilterChip';
import { Button } from '../ui/Button';
import { Calendar, SearchX, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../../data/mockEvents';

export interface LatestEventsSectionProps {
  events: EventItem[];
  allEventsCount: number;
  searchQuery: string;
  onClearSearch: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onViewAllEvents: () => void;
}

export const LatestEventsSection: React.FC<LatestEventsSectionProps> = ({
  events,
  allEventsCount,
  searchQuery,
  onClearSearch,
  selectedCategory,
  onSelectCategory,
  onSelectEvent,
  onViewAllEvents,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

  return (
    <section id="latest-events" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-ui font-bold text-[#20C5C2] mb-2">
              <Calendar className="w-4 h-4" />
              <span>فرص قادمة بالفيوم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#123B5D]">
              أحدث الفعاليات والورش
            </h2>
            <p className="mt-1 text-sm text-slate-500 font-body">
              استكشف المواعيد القريبة واحجز مكانك قبل اكتمال العدد
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              showArrow
              onClick={onViewAllEvents}
              className="text-xs"
            >
              عرض كل الفعاليات ({allEventsCount})
            </Button>
          </div>
        </div>

        {/* Filter Chips Bar (if active filters) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-ui font-semibold text-slate-500">
              الفلاتر النشطة:
            </span>

            {searchQuery.trim() !== '' && (
              <FilterChip
                label={`بحث: "${searchQuery}"`}
                onRemove={onClearSearch}
              />
            )}

            {selectedCategory !== 'all' && (
              <FilterChip
                label={`التصنيف: ${CATEGORIES[selectedCategory]?.label || selectedCategory}`}
                onRemove={() => onSelectCategory('all')}
              />
            )}

            <button
              type="button"
              onClick={() => {
                onClearSearch();
                onSelectCategory('all');
              }}
              className="text-xs font-ui text-[#123B5D] hover:underline font-semibold mr-auto cursor-pointer"
            >
              مسح كل الفلاتر
            </button>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-800 mb-2">
              لم نعثر على نتائج مطابقة
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-body mb-6">
              جرب تغيير كلمات البحث أو إزالة فلتر التصنيف لعرض كافة الفعاليات المتاحة في الفيوم.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClearSearch();
                onSelectCategory('all');
              }}
            >
              إعادة ضبط البحث
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
