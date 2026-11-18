import React from 'react';
import { Sparkles, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { EventCategory } from '../../types';

export interface BrowseByCategorySectionProps {
  onExploreCategory: (category: string) => void;
}

export const BrowseByCategorySection: React.FC<BrowseByCategorySectionProps> = ({
  onExploreCategory,
}) => {
  const categories: Array<{
    key: EventCategory;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgAccent: string;
    countText: string;
  }> = [
    {
      key: 'workshop',
      title: 'ورش عمل',
      badge: 'تطبيق عملي سريع',
      description:
        'جلسات تفاعلية مكثفة تمكنك من ممارسة المهارة بيدك والتعلم المباشر من خبراء الصناعة والتقنية.',
      icon: <Sparkles className="w-6 h-6 text-[#20C5C2]" strokeWidth={1.75} />,
      color: '#20C5C2',
      bgAccent: 'bg-[#EDFAFA] text-[#0D5351] border-[#B3EBEA]',
      countText: 'ورش تفاعلية بالفيوم',
    },
    {
      key: 'course',
      title: 'دورات تدريبية',
      badge: 'مسارات مهنية متكاملة',
      description:
        'برامج تدريبية متخصصة تمتد لعدة أسابيع لتأهيلك لسوق العمل وصقل خبراتك الاحترافية خطوة بخطوة.',
      icon: <BookOpen className="w-6 h-6 text-[#123B5D]" strokeWidth={1.75} />,
      color: '#123B5D',
      bgAccent: 'bg-slate-100 text-[#123B5D] border-slate-200',
      countText: 'دورات معتمدة ومكثفة',
    },
    {
      key: 'event',
      title: 'فعاليات ومؤتمرات',
      badge: 'تواصل وريادة أعمال',
      description:
        'ملتقيات شبابية، هاكاثونات، ومؤتمرات سنوية تفتح أمامك أبواب التواصل مع الشركات والمستثمرين.',
      icon: <Users className="w-6 h-6 text-[#20C5C2]" strokeWidth={1.75} />,
      color: '#20C5C2',
      bgAccent: 'bg-[#EDFAFA] text-[#0D5351] border-[#B3EBEA]',
      countText: 'لقاءات وتجمعات كبرى',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-ui font-bold text-[#123B5D] bg-[#DEE4E8] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            المسارات المتاحة
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#123B5D]">
            تصفح حسب التصنيف
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-body">
            اختر نوع الفرصة التي تناسب وقتك وأهدافك التعليمية والمهنية
          </p>
        </div>

        {/* 3 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#20C5C2]/60 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Top icon and badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <span
                    className={`text-[11px] font-ui font-semibold px-2.5 py-1 rounded-full border ${cat.bgAccent}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-xl text-[#123B5D] mb-2.5 group-hover:text-[#254B6A] transition-colors">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              {/* Bottom Explore Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-ui text-slate-400">
                  {cat.countText}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  showArrow
                  onClick={() => onExploreCategory(cat.key)}
                  className="group-hover:bg-[#123B5D] group-hover:text-white transition-all text-xs"
                >
                  استكشف
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
