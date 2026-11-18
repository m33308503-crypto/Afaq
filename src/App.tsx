import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/home/Hero';
import { LatestEventsSection } from './components/home/LatestEventsSection';
import { BrowseByCategorySection } from './components/home/BrowseByCategorySection';
import { HowToRegisterSection } from './components/home/HowToRegisterSection';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { AdminLayout, AdminSection } from './components/admin/AdminLayout';
import { AdminSectionPlaceholder } from './pages/admin/AdminSectionPlaceholder';
import { RegistrationConfirmModal } from './components/RegistrationConfirmModal';
import { MOCK_EVENTS } from './data/mockEvents';
import { EventItem, RegistrationWithEvent } from './types';
import {
  fetchEvents,
  fetchEventById,
  fetchMyRegistrations,
  registerForEvent,
  cancelRegistration,
  checkAdminAccess,
} from './lib/api';

type RouteState =
  | { page: 'home' }
  | { page: 'events' }
  | { page: 'event-details'; eventId: string }
  | { page: 'login' }
  | { page: 'my-registrations' }
  | { page: 'admin'; section: AdminSection };

function AppContent() {
  const { user, loading: authLoading, logout, getIdToken } = useAuth();

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ page: 'home' });
  const [loginReturnTo, setLoginReturnTo] = useState<string>('/');

  // Database events state
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [currentEvent, setCurrentEvent] = useState<EventItem | undefined>(undefined);

  // User registrations state
  const [myRegistrations, setMyRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState<string | null>(null);
  const [justRegisteredEventId, setJustRegisteredEventId] = useState<string | null>(null);

  // Ephemeral admin route access verification state (never persisted in browser)
  const [adminCheckStatus, setAdminCheckStatus] = useState<
    'idle' | 'checking' | 'authorized' | 'denied'
  >('idle');

  // Filter & Search states (shared and preserved across navigation)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('all');

  // Registration confirmation modal state
  const [eventToRegister, setEventToRegister] = useState<EventItem | null>(null);

  // Load published events from backend API
  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchEvents();
      if (data && Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.warn('Could not fetch events from backend API:', err);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load authenticated user's registrations
  const loadMyRegistrations = useCallback(async () => {
    if (!user) {
      setMyRegistrations([]);
      setRegistrationsError(null);
      return;
    }

    setRegistrationsLoading(true);
    setRegistrationsError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setMyRegistrations([]);
        return;
      }
      const data = await fetchMyRegistrations(token);
      setMyRegistrations(data);
    } catch (err) {
      setRegistrationsError(
        err instanceof Error ? err.message : 'تعذر تحميل قائمة تسجيلاتك'
      );
    } finally {
      setRegistrationsLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    if (!authLoading) {
      loadMyRegistrations();
    }
  }, [user, authLoading, loadMyRegistrations]);

  // Parse path and query parameters from window.location
  const parseCurrentUrl = useCallback(() => {
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    const cat = searchParams.get('category');
    if (cat && ['workshop', 'course', 'event'].includes(cat)) {
      setSelectedCategory(cat);
    }

    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }

    const org = searchParams.get('organizer');
    if (org !== null) {
      setSelectedOrganizer(org);
    }

    const redirect = searchParams.get('redirect');
    if (redirect) {
      setLoginReturnTo(redirect);
    }

    if (pathname === '/login') {
      setCurrentRoute({ page: 'login' });
    } else if (pathname === '/my-registrations') {
      setCurrentRoute({ page: 'my-registrations' });
    } else if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const normalized = pathname.replace(/\/+$/, '');
      let section: AdminSection = 'dashboard';
      if (normalized === '/admin/events') {
        section = 'events';
      } else if (normalized === '/admin/registrations') {
        section = 'registrations';
      }
      setCurrentRoute({ page: 'admin', section });
    } else if (pathname.startsWith('/events/')) {
      const id = pathname.replace('/events/', '').trim();
      setCurrentRoute({ page: 'event-details', eventId: id });
    } else if (pathname === '/events') {
      setCurrentRoute({ page: 'events' });
    } else {
      setCurrentRoute({ page: 'home' });
    }
  }, []);

  useEffect(() => {
    parseCurrentUrl();
    window.addEventListener('popstate', parseCurrentUrl);
    return () => window.removeEventListener('popstate', parseCurrentUrl);
  }, [parseCurrentUrl]);

  // Protected Route Guard for /my-registrations
  useEffect(() => {
    if (!authLoading && currentRoute.page === 'my-registrations' && !user) {
      const target = '/my-registrations';
      setLoginReturnTo(target);
      const url = new URL(window.location.origin + '/login');
      url.searchParams.set('redirect', target);
      window.history.replaceState({}, '', url.toString());
      setCurrentRoute({ page: 'login' });
    }
  }, [authLoading, currentRoute.page, user]);

  // Server-verified Route Guard for /admin/*
  useEffect(() => {
    if (currentRoute.page !== 'admin') {
      setAdminCheckStatus('idle');
      return;
    }

    if (authLoading) {
      setAdminCheckStatus('checking');
      return;
    }

    if (!user) {
      setAdminCheckStatus('denied');
      return;
    }

    let cancelled = false;
    setAdminCheckStatus('checking');

    (async () => {
      try {
        const token = await getIdToken();
        if (!token) {
          if (!cancelled) setAdminCheckStatus('denied');
          return;
        }
        const isAllowed = await checkAdminAccess(token);
        if (!cancelled) {
          setAdminCheckStatus(isAllowed ? 'authorized' : 'denied');
        }
      } catch {
        if (!cancelled) setAdminCheckStatus('denied');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentRoute.page, authLoading, user, getIdToken]);

  // Load active event when on event-details page
  useEffect(() => {
    if (currentRoute.page === 'event-details' && currentRoute.eventId) {
      const found = events.find((e) => e.id === currentRoute.eventId);
      if (found) {
        setCurrentEvent(found);
      } else {
        fetchEventById(currentRoute.eventId)
          .then((data) => {
            setCurrentEvent(data || undefined);
          })
          .catch(() => {
            setCurrentEvent(undefined);
          });
      }
    } else {
      setCurrentEvent(undefined);
      setJustRegisteredEventId(null);
    }
  }, [currentRoute, events]);

  const updateUrl = useCallback((path: string, params?: Record<string, string>) => {
    const url = new URL(window.location.origin + path);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val && val !== 'all') {
          url.searchParams.set(key, val);
        }
      });
    }
    window.history.pushState({}, '', url.toString());
  }, []);

  const navigateToPath = useCallback((fullPath: string) => {
    window.history.pushState({}, '', fullPath);
    parseCurrentUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [parseCurrentUrl]);

  const navigateToHome = useCallback(() => {
    updateUrl('/');
    setCurrentRoute({ page: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateUrl]);

  const navigateToEvents = useCallback(
    (opts?: { category?: string; q?: string; organizer?: string }) => {
      const targetCategory = opts?.category !== undefined ? opts.category : selectedCategory;
      const targetQuery = opts?.q !== undefined ? opts.q : searchQuery;
      const targetOrganizer = opts?.organizer !== undefined ? opts.organizer : selectedOrganizer;

      if (opts?.category !== undefined) setSelectedCategory(opts.category);
      if (opts?.q !== undefined) setSearchQuery(opts.q);
      if (opts?.organizer !== undefined) setSelectedOrganizer(opts.organizer);

      updateUrl('/events', {
        category: targetCategory,
        q: targetQuery,
        organizer: targetOrganizer,
      });

      setCurrentRoute({ page: 'events' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedCategory, searchQuery, selectedOrganizer, updateUrl]
  );

  const navigateToEventDetails = useCallback(
    (eventId: string) => {
      updateUrl(`/events/${eventId}`, {
        category: selectedCategory,
        q: searchQuery,
        organizer: selectedOrganizer,
      });
      setJustRegisteredEventId(null);
      setCurrentRoute({ page: 'event-details', eventId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedCategory, searchQuery, selectedOrganizer, updateUrl]
  );

  const navigateToLogin = useCallback(
    (explicitReturnTo?: string) => {
      const currentFull = window.location.pathname + window.location.search;
      const returnPath =
        explicitReturnTo ||
        (currentFull && !currentFull.startsWith('/login') ? currentFull : '/');

      setLoginReturnTo(returnPath);
      updateUrl('/login', { redirect: returnPath });
      setCurrentRoute({ page: 'login' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateUrl]
  );

  const navigateToMyRegistrations = useCallback(() => {
    if (!user) {
      navigateToLogin('/my-registrations');
      return;
    }
    updateUrl('/my-registrations');
    setCurrentRoute({ page: 'my-registrations' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user, navigateToLogin, updateUrl]);

  const navigateBackFromEvents = useCallback(() => {
    navigateToHome();
  }, [navigateToHome]);

  const navigateBackFromEventDetails = useCallback(() => {
    updateUrl('/events', {
      category: selectedCategory,
      q: searchQuery,
      organizer: selectedOrganizer,
    });
    setCurrentRoute({ page: 'events' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, searchQuery, selectedOrganizer, updateUrl]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedOrganizer('all');
    updateUrl('/events');
  }, [updateUrl]);

  // Register button clicked on EventDetailsPage
  const handleRegisterClick = useCallback(
    (event: EventItem) => {
      if (!user) {
        navigateToLogin(`/events/${event.id}`);
        return;
      }
      setEventToRegister(event);
    },
    [user, navigateToLogin]
  );

  // Confirm registration inside RegistrationConfirmModal
  const handleConfirmRegister = useCallback(
    async (event: EventItem) => {
      const token = await getIdToken();
      if (!token) {
        throw new Error('يرجى تسجيل الدخول أولاً لإتمام التسجيل.');
      }

      await registerForEvent(token, event.id);
      setJustRegisteredEventId(event.id);
      await Promise.all([loadMyRegistrations(), loadEvents()]);
    },
    [getIdToken, loadMyRegistrations, loadEvents]
  );

  // Cancel registration handler (used in both MyRegistrationsPage and EventDetailsPage)
  const handleCancelRegistration = useCallback(
    async (registrationId: string) => {
      const token = await getIdToken();
      if (!token) {
        throw new Error('يرجى تسجيل الدخول أولاً.');
      }
      await cancelRegistration(token, registrationId);
      setJustRegisteredEventId(null);
      await Promise.all([loadMyRegistrations(), loadEvents()]);
    },
    [getIdToken, loadMyRegistrations, loadEvents]
  );

  const navigateToAdminSection = useCallback(
    (section: AdminSection) => {
      const path =
        section === 'dashboard'
          ? '/admin'
          : section === 'events'
          ? '/admin/events'
          : '/admin/registrations';
      updateUrl(path);
      setCurrentRoute({ page: 'admin', section });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateUrl]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setMyRegistrations([]);
    setJustRegisteredEventId(null);
    setAdminCheckStatus('idle');
    if (currentRoute.page === 'my-registrations' || currentRoute.page === 'admin') {
      navigateToHome();
    }
  }, [logout, currentRoute.page, navigateToHome]);

  const homeEvents = useMemo(() => {
    return events.filter((ev) => ev.status === 'published');
  }, [events]);

  // Check if current event is already registered by logged-in user
  const currentEventRegistration = useMemo(() => {
    if (!currentEvent || !user) return undefined;
    return myRegistrations.find((r) => r.eventId === currentEvent.id);
  }, [currentEvent, user, myRegistrations]);

  const activeHeaderTab =
    currentRoute.page === 'home'
      ? 'home'
      : currentRoute.page === 'my-registrations'
      ? 'my-registrations'
      : currentRoute.page === 'login'
      ? 'login'
      : 'events';

  const adminSectionTitleMap: Record<AdminSection, string> = {
    dashboard: 'لوحة التحكم',
    events: 'الفعاليات',
    registrations: 'التسجيلات',
  };

  if (currentRoute.page === 'admin' && adminCheckStatus === 'authorized' && user) {
    return (
      <AdminLayout
        activeSection={currentRoute.section}
        userName={user.name || user.email}
        onNavigateSection={navigateToAdminSection}
        onNavigatePublicHome={navigateToHome}
        onLogout={handleLogout}
      >
        <AdminSectionPlaceholder title={adminSectionTitleMap[currentRoute.section]} />
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#20C5C2]/20 selection:text-[#123B5D]">
      {/* Top Header */}
      <Header
        currentTab={activeHeaderTab}
        user={user}
        onNavigateTab={(tab) => {
          if (tab === 'home') {
            navigateToHome();
          } else if (tab === 'my-registrations') {
            navigateToMyRegistrations();
          } else {
            navigateToEvents();
          }
        }}
        onNavigateToLogin={() => navigateToLogin()}
        onLogout={handleLogout}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {/* Page 1: Home Page */}
        {currentRoute.page === 'home' && (
          <div>
            <Hero
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => setSelectedCategory(cat)}
              onExploreClick={() => navigateToEvents()}
            />

            <LatestEventsSection
              events={homeEvents}
              allEventsCount={homeEvents.length}
              searchQuery=""
              onClearSearch={() => {}}
              selectedCategory="all"
              onSelectCategory={() => {}}
              onSelectEvent={(ev) => navigateToEventDetails(ev.id)}
              onViewAllEvents={() => navigateToEvents()}
            />

            <BrowseByCategorySection
              onExploreCategory={(cat) => navigateToEvents({ category: cat })}
            />

            <HowToRegisterSection
              onStartExploring={() => navigateToEvents()}
            />
          </div>
        )}

        {/* Page 2: /events (All Events Page with Search & Filters) */}
        {currentRoute.page === 'events' && (
          <EventsPage
            events={events}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              updateUrl('/events', {
                category: selectedCategory,
                q,
                organizer: selectedOrganizer,
              });
            }}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              updateUrl('/events', {
                category: cat,
                q: searchQuery,
                organizer: selectedOrganizer,
              });
            }}
            selectedOrganizer={selectedOrganizer}
            onOrganizerChange={(org) => {
              setSelectedOrganizer(org);
              updateUrl('/events', {
                category: selectedCategory,
                q: searchQuery,
                organizer: org,
              });
            }}
            onClearFilters={handleClearFilters}
            onSelectEvent={(ev) => navigateToEventDetails(ev.id)}
            onGoBack={navigateBackFromEvents}
          />
        )}

        {/* Page 3: /events/:id (Event Details Page) */}
        {currentRoute.page === 'event-details' && (
          <EventDetailsPage
            event={currentEvent}
            isRegistered={Boolean(currentEventRegistration)}
            registrationId={currentEventRegistration?.id}
            justRegistered={Boolean(
              currentEvent && justRegisteredEventId === currentEvent.id
            )}
            onGoBack={navigateBackFromEventDetails}
            onRegisterClick={handleRegisterClick}
            onCancelRegistration={handleCancelRegistration}
            onGoToMyRegistrations={navigateToMyRegistrations}
          />
        )}

        {/* Page 4: /login (Google Sign-In Only) */}
        {currentRoute.page === 'login' && (
          <LoginPage
            returnTo={loginReturnTo}
            onLoginSuccess={(redirectPath) => {
              navigateToPath(redirectPath || '/');
            }}
            onGoBack={() => {
              if (loginReturnTo && loginReturnTo !== '/login' && !loginReturnTo.startsWith('/my-registrations')) {
                navigateToPath(loginReturnTo);
              } else {
                navigateToHome();
              }
            }}
          />
        )}

        {/* Page 5: /my-registrations (Protected Attendee Registrations Page) */}
        {currentRoute.page === 'my-registrations' && user && (
          <MyRegistrationsPage
            registrations={myRegistrations}
            loading={registrationsLoading}
            error={registrationsError}
            onSelectEvent={(ev) => navigateToEventDetails(ev.id)}
            onBrowseEvents={() => navigateToEvents()}
            onGoBack={navigateToHome}
            onCancelRegistration={handleCancelRegistration}
          />
        )}

        {/* Page 6: /admin/* Guard (Loading or Unauthorized) */}
        {currentRoute.page === 'admin' &&
          (authLoading || adminCheckStatus === 'idle' || adminCheckStatus === 'checking') && (
            <div className="py-24 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#123B5D] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-ui text-slate-600">جارٍ التحقق من الصلاحيات...</p>
              </div>
            </div>
          )}

        {currentRoute.page === 'admin' &&
          !authLoading &&
          adminCheckStatus === 'denied' && (
            <UnauthorizedPage
              isLoggedIn={Boolean(user)}
              onGoHome={navigateToHome}
              onGoToLogin={() => navigateToLogin(window.location.pathname)}
            />
          )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateHome={navigateToHome}
        onNavigateEvents={() => navigateToEvents()}
        onNavigateCategory={(cat) => navigateToEvents({ category: cat })}
      />

      {/* Registration Confirmation Modal */}
      <RegistrationConfirmModal
        event={eventToRegister}
        isOpen={Boolean(eventToRegister)}
        onClose={() => setEventToRegister(null)}
        onConfirmRegister={handleConfirmRegister}
        onGoToMyRegistrations={navigateToMyRegistrations}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
