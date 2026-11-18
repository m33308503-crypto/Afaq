import { EventItem, RegistrationRecord, RegistrationWithEvent, UserProfile } from '../types';

export interface EventFilters {
  category?: string;
  organizer?: string;
  q?: string;
}

/**
 * Fetches published events from the server database API
 */
export async function fetchEvents(filters?: EventFilters): Promise<EventItem[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters?.organizer && filters.organizer !== 'all') {
    params.set('organizer', filters.organizer);
  }
  if (filters?.q && filters.q.trim() !== '') {
    params.set('q', filters.q.trim());
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/events${query}`);
  if (!response.ok) {
    throw new Error('فشل جلب الفعاليات من الخادم');
  }

  return response.json();
}

/**
 * Fetches a single published event by ID from the database
 */
export async function fetchEventById(id: string): Promise<EventItem | null> {
  const response = await fetch(`/api/events/${encodeURIComponent(id)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('فشل جلب بيانات الفعالية من الخادم');
  }

  return response.json();
}

/**
 * Fetches distinct organizers from the database
 */
export async function fetchOrganizers(): Promise<string[]> {
  const response = await fetch('/api/organizers');
  if (!response.ok) {
    throw new Error('فشل جلب قائمة المنظمين');
  }

  return response.json();
}

/**
 * Syncs authenticated Google user with backend `users` table
 */
export async function syncUserWithBackend(token: string): Promise<UserProfile> {
  const response = await fetch('/api/auth/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'تعذر مزامنة بيانات الحساب');
  }

  const data = await response.json();
  return data.user;
}

/**
 * Fetches authenticated user's registrations (ordered nearest first)
 */
export async function fetchMyRegistrations(token: string): Promise<RegistrationWithEvent[]> {
  const response = await fetch('/api/registrations/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'تعذر تحميل قائمة تسجيلاتك');
  }

  return response.json();
}

/**
 * Registers the authenticated user for an event
 */
export async function registerForEvent(
  token: string,
  eventId: string
): Promise<RegistrationRecord> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'تعذر إتمام التسجيل في الفعالية');
  }

  return body;
}

/**
 * Cancels an existing registration owned by the authenticated user
 */
export async function cancelRegistration(
  token: string,
  registrationId: string
): Promise<{ message: string }> {
  const response = await fetch(`/api/registrations/${encodeURIComponent(registrationId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'تعذر إلغاء التسجيل');
  }

  return body;
}

/**
 * Verifies with the server `user_roles` table whether the current session is an admin.
 * Does NOT cache or store the role in browser storage.
 */
export async function checkAdminAccess(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/access', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

