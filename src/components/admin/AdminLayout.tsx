import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { AfaqLogo } from '../AfaqLogo';

export type AdminSection = 'dashboard' | 'events' | 'registrations';

export interface AdminLayoutProps {
  activeSection: AdminSection;
  userName: string;
  onNavigateSection: (section: AdminSection) => void;
  onNavigatePublicHome: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeSection,
  userName,
  onNavigateSection,
  onNavigatePublicHome,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    key: AdminSection;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'dashboard',
      label: 'لوحة التحكم',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
    },
    {
      key: 'events',
      label: 'الفعاليات',
      icon: <CalendarDays className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
    },
    {
      key: 'registrations',
      label: 'التسجيلات',
      icon: <ClipboardList className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
    },
  ];

  const handleSelect = (section: AdminSection) => {
    onNavigateSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* Desktop Right Sidebar (RTL) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-white border-l border-slate-200 min-h-screen sticky top-0">
        {/* Sidebar Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-200">
          <button
            type="button"
            onClick={onNavigatePublicHome}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] rounded-lg cursor-pointer"
          >
            <AfaqLogo size="sm" />
          </button>
          <span className="text-[11px] font-ui font-bold text-[#123B5D] bg-[#EDFAFA] border border-[#B3EBEA] px-2.5 py-0.5 rounded-full">
            الإدارة
          </span>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 font-ui" aria-label="قائمة لوحة التحكم">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] ${
                  isActive
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-[#F1F3F5] hover:text-[#123B5D]'
                }`}
              >
                <span className={isActive ? 'text-[#20C5C2]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom User & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-2.5">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="block text-[11px] font-ui text-slate-400">الحساب الحالي</span>
            <span className="block text-xs font-ui font-bold text-[#123B5D] truncate">
              {userName}
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigatePublicHome}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold text-[#123B5D] hover:bg-[#F1F3F5] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>العودة للمنصة</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header & Dropdown Navigation */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AfaqLogo size="sm" />
            <span className="text-[11px] font-ui font-bold text-[#123B5D] bg-[#EDFAFA] border border-[#B3EBEA] px-2 py-0.5 rounded-full">
              الإدارة
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-ui font-bold text-[#123B5D] hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2]"
            aria-expanded={mobileMenuOpen}
            aria-label="قائمة لوحة التحكم"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
            <span>القائمة</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                mobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 space-y-1.5 shadow-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelect(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-ui font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#123B5D] text-white'
                      : 'text-slate-700 hover:bg-[#F1F3F5] hover:text-[#123B5D]'
                  }`}
                >
                  <span className={isActive ? 'text-[#20C5C2]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigatePublicHome();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold text-[#123B5D] hover:bg-[#F1F3F5] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للمنصة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full">{children}</main>
    </div>
  );
};
