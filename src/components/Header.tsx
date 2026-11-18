import React, { useState } from 'react';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { AfaqLogo } from './AfaqLogo';
import { Button } from './ui/Button';
import { UserProfile } from '../types';

export interface HeaderProps {
  currentTab?: 'home' | 'events' | 'my-registrations' | 'login';
  user: UserProfile | null;
  onNavigateTab?: (tab: 'home' | 'events' | 'my-registrations') => void;
  onNavigateToLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  user,
  onNavigateTab,
  onNavigateToLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Lockup */}
        <div className="shrink-0 flex items-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTab?.('home');
            }}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C5C2] rounded-lg"
          >
            <AfaqLogo size="md" />
          </a>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-ui font-semibold">
          <button
            type="button"
            onClick={() => onNavigateTab?.('home')}
            className={`transition-colors py-1 cursor-pointer relative whitespace-nowrap shrink-0 ${
              currentTab === 'home'
                ? 'text-[#123B5D] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#123B5D]'
                : 'text-slate-600 hover:text-[#123B5D]'
            }`}
          >
            الرئيسية
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('events')}
            className={`transition-colors py-1 cursor-pointer relative whitespace-nowrap shrink-0 ${
              currentTab === 'events'
                ? 'text-[#123B5D] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#123B5D]'
                : 'text-slate-600 hover:text-[#123B5D]'
            }`}
          >
            الفعاليات
          </button>
          {user && (
            <button
              type="button"
              onClick={() => onNavigateTab?.('my-registrations')}
              className={`transition-colors py-1 cursor-pointer relative whitespace-nowrap shrink-0 ${
                currentTab === 'my-registrations'
                  ? 'text-[#123B5D] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#123B5D]'
                  : 'text-slate-600 hover:text-[#123B5D]'
              }`}
            >
              تسجيلاتي
            </button>
          )}
        </nav>

        {/* Zone 3: User / Primary Action (Desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-ui font-semibold text-[#123B5D] max-w-[180px] truncate">
                <User className="w-4 h-4 text-[#20C5C2] shrink-0" />
                <span className="truncate">{user.name}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={<LogOut className="w-4 h-4" />}
                onClick={() => onLogout?.()}
                className="whitespace-nowrap shrink-0"
              >
                تسجيل الخروج
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<LogIn className="w-4 h-4 ml-1" />}
              onClick={() => onNavigateToLogin?.()}
              className="whitespace-nowrap shrink-0"
            >
              تسجيل الدخول
            </Button>
          )}
        </div>

        {/* Mobile Hamburger & Compact Action */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateToLogin?.()}
              className="px-3 text-xs whitespace-nowrap"
            >
              تسجيل الدخول
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateTab?.('my-registrations')}
              className="inline-flex items-center gap-1.5 text-xs font-ui font-bold text-[#123B5D] bg-[#F1F3F5] px-3 py-1.5 rounded-full max-w-[140px] truncate cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#20C5C2] shrink-0" />
              <span className="truncate">{user.name}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-[#123B5D] hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#20C5C2] cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 flex flex-col gap-3 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onNavigateTab?.('home');
              setMobileMenuOpen(false);
            }}
            className={`text-right px-3 py-2.5 rounded-xl font-ui text-sm font-semibold transition-colors cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#F1F3F5] text-[#123B5D]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            الرئيسية
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateTab?.('events');
              setMobileMenuOpen(false);
            }}
            className={`text-right px-3 py-2.5 rounded-xl font-ui text-sm font-semibold transition-colors cursor-pointer ${
              currentTab === 'events'
                ? 'bg-[#F1F3F5] text-[#123B5D]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            الفعاليات
          </button>

          {user && (
            <button
              type="button"
              onClick={() => {
                onNavigateTab?.('my-registrations');
                setMobileMenuOpen(false);
              }}
              className={`text-right px-3 py-2.5 rounded-xl font-ui text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'my-registrations'
                  ? 'bg-[#F1F3F5] text-[#123B5D]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              تسجيلاتي
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between gap-3 px-2">
                <span className="text-xs font-ui font-semibold text-slate-600 truncate">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                >
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<LogIn className="w-4 h-4 ml-1" />}
                onClick={() => {
                  onNavigateToLogin?.();
                  setMobileMenuOpen(false);
                }}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
