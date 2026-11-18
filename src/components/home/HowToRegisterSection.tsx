import React from 'react';
import { Compass, CheckCircle2, UserCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HowToRegisterSectionProps {
  onStartExploring: () => void;
}

export const HowToRegisterSection: React.FC<HowToRegisterSectionProps> = ({
  onStartExploring,
}) => {
  const steps = [
    {
      number: '01',
      title: 'استكشف الفرص والفعاليات',
      description:
        'تصفح أحدث الورش والدورات في مجالات التكنولوجيا والحرف اليدوية وريادة الأعمال المنتشرة بمراكز وقرى الفيوم.',
      icon: <Compass className="w-6 h-6 text-[#20C5C2]" strokeWidth={1.75} />,
    },
    {
      number: '02',
      title: 'سجّل دخولك بحساب جوجل',
      description:
        'لا حاجة لملء نماذج طويلة أو روابط مكررة. دخول فوري وآمن بحسابك في جوجل بضغطة زر واحدة.',
      icon: <UserCheck className="w-6 h-6 text-[#123B5D]" strokeWidth={1.75} />,
    },
    {
      number: '03',
      title: 'أكّد حجزك وتابع تسجيلاتك',
      description:
        'احجز مقعدك مباشرة واطّلع على كافة التفاصيل والموقع وتواصل مع المنظمين بيسر وسهولة.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#20C5C2]" strokeWidth={1.75} />,
    },
  ];

  return (
    <section id="how-to-register" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-ui font-bold text-[#168A88] bg-[#EDFAFA] border border-[#B3EBEA] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            بساطة وسرعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#123B5D]">
            إزاي تسجل في ٣ خطوات؟
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-body">
            صممنا المنصة لتختصر عليك وقت البحث بين الجروبات والبوستات وتصل للفرصة مباشرة
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line on desktop */}
          <div className="hidden md:block absolute top-1/3 right-[15%] left-[15%] h-0.5 bg-gradient-to-l from-slate-200 via-[#20C5C2]/40 to-slate-200 z-0 pointer-events-none" />

          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center text-center bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Step Number & Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-2xs">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#123B5D] text-white text-xs font-ui font-bold flex items-center justify-center shadow-xs">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-lg text-[#123B5D] mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-14 p-8 rounded-2xl bg-[#F1F3F5] border border-[#BDC8D2] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
          <div>
            <h4 className="font-heading font-bold text-lg text-[#123B5D]">
              جاهز لاكتشاف أول ورشة تناسب طموحك؟
            </h4>
            <p className="text-xs sm:text-sm text-[#41627D] font-body mt-1">
              انضم لمئات الشباب في الفيوم الذين يطورون مهاراتهم أسبوعياً.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            showArrow
            onClick={onStartExploring}
          >
            استكشف الفعاليات الآن
          </Button>
        </div>
      </div>
    </section>
  );
};
