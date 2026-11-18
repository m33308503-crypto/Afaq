import React from 'react';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';
import { Select } from '../ui/Select';
import { Sparkles } from 'lucide-react';

export interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onExploreClick,
}) => {
  const categoryOptions = [
    { value: 'all', label: 'كل التصنيفات' },
    { value: 'workshop', label: 'ورش عمل' },
    { value: 'course', label: 'دورات تدريبية' },
    { value: 'event', label: 'فعاليات ومؤتمرات' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0B253A] text-white py-16 sm:py-20 lg:py-24">
      {/* Background Visual: Fayoum lake & mountain panorama from brand board with deep blue gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/public/assets/aistudio/6026110618810650662__1__136d36d0.jpg"
          alt="طبيعة الفيوم وبحيرة قارون"
          className="w-full h-full object-cover object-top opacity-20 filter saturate-150 contrast-125"
          onError={(e) => {
            // Graceful fallback if path resolution differs
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Deep blue brand gradient scrim ensuring high contrast WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B253A]/95 via-[#123B5D]/90 to-[#0B253A]/95" />

        {/* Thematic flowing curves representing Lake Qarun and Fayoum sand dunes */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-32 text-white/5 pointer-events-none"
          viewBox="0 0 1440 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80 C 320 160 580 40 920 120 C 1180 180 1340 90 1440 60 L 1440 180 L 0 180 Z"
            fill="currentColor"
          />
          <path
            d="M0 120 C 380 60 700 160 1020 90 C 1240 40 1380 110 1440 100 L 1440 180 L 0 180 Z"
            fill="#20C5C2"
            fillOpacity="0.06"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Subtle Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#51D2CF] text-xs sm:text-sm font-ui font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#20C5C2]" />
            <span>منصة شباب الفيوم الموحدة للفرص والمهارات</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight mb-5"
            style={{ textWrap: 'balance' }}
          >
            اكتشف آفاقك الجديدة
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 font-body leading-relaxed mb-8 max-w-2xl">
            تعلم، شارك، وتطور في مجتمع واحد. اعثر على أحدث ورش العمل والدورات والفعاليات في أنحاء محافظة الفيوم وسجّل فيها بضغطة زر.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Button
              variant="secondary"
              size="lg"
              showArrow
              onClick={onExploreClick}
              className="text-base font-bold shadow-md hover:shadow-[#20C5C2]/30 px-8"
            >
              ابدأ الاستكشاف
            </Button>
          </div>

          {/* Unified Quick Search & Filter Card (48px height controls) */}
          <div className="w-full max-w-2xl bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-[#0B253A]/40 border border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* Search text input */}
              <div className="w-full sm:flex-1">
                <SearchInput
                  value={searchQuery}
                  onChangeValue={onSearchChange}
                  placeholder="ابحث عن ورشة، دورة، أو فعالية في الفيوم..."
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              {/* Category Select */}
              <div className="w-full sm:w-48 shrink-0">
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChangeValue={onCategoryChange}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white font-semibold"
                />
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onExploreClick}
                  className="w-full sm:w-auto px-6 h-12"
                >
                  بحث
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
