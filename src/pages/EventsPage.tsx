import React, { useMemo } from 'react';
import { ArrowRight, SearchX, RotateCcw, Building2, Layers } from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { CATEGORIES } from '../data/mockEvents';
import { EventCard } from '../components/EventCard';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { FilterChip } from '../components/ui/FilterChip';
import { Button } from '../components/ui/Button';

export interface EventsPageProps {
  events: EventItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedOrganizer: string;
  onOrganizerChange: (organizer: string) => void;
  onClearFilters: () => void;
  onSelectEvent: (event: EventItem) => void;
  onGoBack: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedOrganizer,
  onOrganizerChange,
  onClearFilters,
  onSelectEvent,
  onGoBack,
}) => {
  // Extract distinct organizers from published events
  const organizerOptions = useMemo(() => {
    const organizers = Array.from(
      new Set(
        events
          .filter((e) => e.status === 'published')
          .map((e) => e.organizer)
      )
    ).sort();

    return [
      { value: 'all', label: 'كل الجهات المنظمة' },
      ...organizers.map((org) => ({ value: org, label: org })),
    ];
  }, [events]);

  // Category chips configuration
  const categoryChips: Array<{ key: string; label: string }> = [
    { key: 'all', label: 'كل التصنيفات' },
    { key: 'workshop', label: 'ورش عمل' },
    { key: 'course', label: 'دورات تدريبية' },
    { key: 'event', label: 'فعاليات ومؤتمرات' },
  ];

  // Filter published events by search (title or organizer), category, and organizer
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Must be published
      if (ev.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // Organizer filter
      if (selectedOrganizer !== 'all' && ev.organizer !== selectedOrganizer) {
        return false;
      }

      // Search query: matches title OR organizer
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = ev.title.toLowerCase().includes(query);
        const matchesOrg = ev.organizer.toLowerCase().includes(query);
        return matchesTitle || matchesOrg;
      }

      return true;
    });
  }, [events, selectedCategory, selectedOrganizer, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedOrganizer !== 'all';

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[calc(100vh-280px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-sm font-ui font-semibold text-[#123B5D] hover:text-[#254B6A] py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>رجوع للصفحة السابقة</span>
          </button>
        </div>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#123B5D]">
              كل الفعاليات
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 font-body">
              استكشف جميع الورش والدورات والفعاليات المنشورة في الفيوم
            </p>
          </div>

          <div className="text-xs font-ui font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span>عدد الفعاليات المتاحة: </span>
            <strong className="text-[#123B5D] font-bold">
              {filteredEvents.length}
            </strong>
          </div>
        </div>

        {/* Search & Filter Controls Section */}
        <div className="bg-[#F1F3F5] border border-[#DEE4E8] rounded-2xl p-4 sm:p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input: Matches title OR organizer */}
            <div className="md:col-span-7">
              <SearchInput
                value={searchQuery}
                onChangeValue={onSearchChange}
                placeholder="ابحث بالعنوان أو اسم الجهة المنظمة..."
                className="bg-white"
              />
            </div>

            {/* Organizer Dropdown */}
            <div className="md:col-span-5">
              <Select
                options={organizerOptions}
                value={selectedOrganizer}
                onChangeValue={onOrganizerChange}
                className="bg-white font-medium"
              />
            </div>
          </div>

          {/* Category Chips Bar & Clear Filters Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-ui font-semibold text-[#41627D] ml-1">
                التصنيف:
              </span>
              {categoryChips.map((chip) => {
                const isActive = selectedCategory === chip.key;
                return (
                  <FilterChip
                    key={chip.key}
                    label={chip.label}
                    active={isActive}
                    onClick={() => onCategoryChange(chip.key)}
                  />
                );
              })}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-ui font-bold text-[#123B5D] hover:text-[#DC2626] transition-colors py-1 px-2.5 rounded-lg hover:bg-white cursor-pointer mr-auto sm:mr-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح كل الفلاتر</span>
              </button>
            )}
          </div>
        </div>

        {/* Events Grid (3 cols on desktop, 2 cols on tablet, 1 col on mobile) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={() => onSelectEvent(event)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#123B5D] mb-2">
              لم نعثر على أي فعاليات مطابقة
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-body mb-6 leading-relaxed">
              لا توجد فعاليات منشورة تطابق معايير البحث والفلترة المحددة. جرّب
              تعديل كلمة البحث أو مسح الفلاتر لعرض كافة الفعاليات المتاحة.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-4 h-4 ml-1.5" />}
              onClick={onClearFilters}
            >
              مسح الفلاتر وإظهار كل الفعاليات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
