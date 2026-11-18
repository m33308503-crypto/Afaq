import React from 'react';
import { MapPin, Mail, ArrowUpLeft } from 'lucide-react';
import { AfaqLogo } from './AfaqLogo';

export interface FooterProps {
  onNavigateCategory?: (category: string) => void;
  onNavigateHome?: () => void;
  onNavigateEvents?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCategory,
  onNavigateHome,
  onNavigateEvents,
}) => {
  return (
    <footer className="bg-[#0B253A] text-white border-t border-[#123B5D] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 1000 300" fill="none">
          <path
            d="M0 250 C 300 120, 600 280, 1000 150 L 1000 300 L 0 300 Z"
            fill="#20C5C2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <AfaqLogo size="md" theme="white-on-dark" showTagline />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-body mt-2">
              المنصة الموحدة لشباب محافظة الفيوم لاكتشاف الورش التدريبية والدورات
              المتخصصة والفعاليات الثقافية والتكنولوجية والتسجيل فيها بسهولة.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#51D2CF] font-ui mt-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#20C5C2]" />
              <span>محافظة الفيوم — مصر</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3 font-ui text-sm">
            <h4 className="text-white font-bold text-base mb-1 border-b border-white/10 pb-2">
              روابط المنصة
            </h4>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-right text-slate-300 hover:text-[#20C5C2] transition-colors py-1 cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={onNavigateEvents}
              className="text-right text-slate-300 hover:text-[#20C5C2] transition-colors py-1 cursor-pointer"
            >
              كل الفعاليات
            </button>
            <a
              href="#how-to-register"
              className="text-slate-300 hover:text-[#20C5C2] transition-colors py-1"
            >
              كيفية التسجيل
            </a>
          </div>

          {/* Categories Shortcuts */}
          <div className="md:col-span-4 flex flex-col gap-3 font-ui text-sm">
            <h4 className="text-white font-bold text-base mb-1 border-b border-white/10 pb-2">
              تصنيفات الفرص
            </h4>
            <button
              type="button"
              onClick={() => onNavigateCategory?.('workshop')}
              className="flex items-center justify-between text-slate-300 hover:text-[#20C5C2] transition-colors py-1 text-right cursor-pointer group"
            >
              <span>ورش عمل تطبيقية</span>
              <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateCategory?.('course')}
              className="flex items-center justify-between text-slate-300 hover:text-[#20C5C2] transition-colors py-1 text-right cursor-pointer group"
            >
              <span>دورات تدريبية متخصصة</span>
              <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateCategory?.('event')}
              className="flex items-center justify-between text-slate-300 hover:text-[#20C5C2] transition-colors py-1 text-right cursor-pointer group"
            >
              <span>ملتقيات ومؤتمرات شبابية</span>
              <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-[#20C5C2]" />
              <span>للتواصل مع منظمي الفعاليات: support@afaq-fayoum.eg</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-ui">
          <p>© {new Date().getFullYear()} منصة آفاق (AFAQ). جميع الحقوق محفوظة لشباب الفيوم.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>صُنعت بروح وهوية الفيوم</span>
            <span className="text-[#20C5C2]">🌿</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
