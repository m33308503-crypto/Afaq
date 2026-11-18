import fs from 'fs';
import path from 'path';

export type EventCategory = 'workshop' | 'course' | 'event';
export type EventStatus = 'draft' | 'published' | 'hidden';
export type AppRole = 'admin' | 'user';

export interface UserRecord {
  id: string; // User ID from Firebase Auth
  name: string;
  email: string;
  createdAt: string;
}

export interface UserRoleRecord {
  userId: string;
  role: AppRole;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string; // ISO timestamp with timezone
  dateLabel: string;
  timeLabel?: string;
  location: string;
  organizer: string;
  coverImageUrl?: string;
  status: EventStatus;
  createdAt: string;
  seatsTotal?: number;
  seatsTaken?: number;
}

export interface RegistrationRecord {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
}

// Initial bootstrap admin email approved by the project owner
const INITIAL_ADMIN_EMAIL = 'm33308503@gmail.com';

// Initial seed data: The 6 Fayoum events seeded with status 'published'
const SEED_EVENTS: EventRecord[] = [
  {
    id: 'ev-1',
    title: 'الذكاء الاصطناعي وتطبيقاته العملية للشباب',
    description: 'ورشة عمل تفاعلية تركّز على استخدام أدوات الذكاء الاصطناعي التوليدي في إنجاز المهام اليومية، البرمجة، وصناعة المحتوى الرقمي.',
    category: 'workshop',
    startsAt: '2025-11-15T16:00:00+02:00',
    dateLabel: '15 نوفمبر 2025',
    timeLabel: '04:00 م - 07:00 م',
    location: 'مركز إبداع مصر الرقمية (كريتيفا) - جامعة الفيوم',
    organizer: 'مجتمع مطوري الفيوم (Fayoum Devs)',
    status: 'published',
    createdAt: '2025-11-01T10:00:00Z',
    seatsTotal: 40,
    seatsTaken: 28,
  },
  {
    id: 'ev-2',
    title: 'أساسيات وتصميم الخزف والفخار اليدوي الحديث',
    description: 'دورة تدريبية متكاملة لاكتشاف أسرار صناعة الخزف التراثي والمعاصر تحت إشراف نخبة من كبار حرفيي وفناني قرية تونس بالفيوم.',
    category: 'course',
    startsAt: '2025-11-18T10:00:00+02:00',
    dateLabel: '18 نوفمبر 2025',
    timeLabel: '10:00 ص - 02:00 م',
    location: 'مدرسة الخزف، قرية تونس، يوسف الصديق، الفيوم',
    organizer: 'مدرسة تونس للحرف اليدوية',
    status: 'published',
    createdAt: '2025-11-02T11:00:00Z',
    seatsTotal: 20,
    seatsTaken: 19,
  },
  {
    id: 'ev-3',
    title: 'ملتقى شباب الفيوم لريادة الأعمال والابتكار 2025',
    description: 'الملتقى السنوي الأكبر لشباب ورواد الأعمال في محافظة الفيوم؛ جلسات حوارية، تجارب ملهمة، وفرص تواصل وتمويل مع حاضنات ومستثمرين.',
    category: 'event',
    startsAt: '2025-11-22T09:30:00+02:00',
    dateLabel: '22 نوفمبر 2025',
    timeLabel: '09:30 ص - 05:00 م',
    location: 'المسرح الكبير - قصر ثقافة الفيوم، ميدان السواقي',
    organizer: 'مؤسسة رواد الفيوم وحاضنة الأعمال',
    status: 'published',
    createdAt: '2025-11-03T12:00:00Z',
    seatsTotal: 150,
    seatsTaken: 112,
  },
  {
    id: 'ev-4',
    title: 'التسويق الرقمي وإدارة الحملات الإعلانية للشركات الناشئة',
    description: 'برنامج تدريبي يغطي استراتيجيات الإعلانات الممولة على ميتا وجوجل، وتحليل البيانات واستقطاب العملاء بتكلفة فعالة.',
    category: 'course',
    startsAt: '2025-11-26T17:00:00+02:00',
    dateLabel: '26 نوفمبر 2025',
    timeLabel: '05:00 م - 08:30 م',
    location: 'مساحة عمل كود لاب، شارع النبوي المهندس، الفيوم',
    organizer: 'أكاديمية آفاق للتأهيل الرقمي',
    status: 'published',
    createdAt: '2025-11-04T13:00:00Z',
    seatsTotal: 30,
    seatsTaken: 22,
  },
  {
    id: 'ev-5',
    title: 'فنون التصوير التوثيقي وصناعة المحتوى المرئي لطبيعة الفيوم',
    description: 'جولة ميدانية وورشة عمل عملية لتعلم تقنيات التصوير الفوتوغرافي وإعداد التقارير البصرية وسط الطبيعة الساحرة لوادي الريان.',
    category: 'workshop',
    startsAt: '2025-11-30T07:00:00+02:00',
    dateLabel: '30 نوفمبر 2025',
    timeLabel: '07:00 ص - 03:00 م',
    location: 'محمية وادي الريان وبحيرة قارون، الفيوم',
    organizer: 'نادي عدسة الفيوم الفوتوغرافي',
    status: 'published',
    createdAt: '2025-11-05T14:00:00Z',
    seatsTotal: 25,
    seatsTaken: 24,
  },
  {
    id: 'ev-6',
    title: 'هاكاثون حلول التنمية المستدامة والمياه بالفيوم',
    description: 'تحدٍ تقني لمدة 48 ساعة للفرق الشبابية لابتكار حلول برمجية وهندسية تخدم قضايا الزراعة الذكية وإدارة الموارد المائية في المحافظة.',
    category: 'event',
    startsAt: '2025-12-05T08:00:00+02:00',
    dateLabel: '05 ديسمبر 2025',
    timeLabel: '08:00 ص - 06:00 م',
    location: 'مركز التعليم المدني والشباب، المسلة، الفيوم',
    organizer: 'مبادرة الفيوم الخضراء وجامعة الفيوم',
    status: 'published',
    createdAt: '2025-11-06T15:00:00Z',
    seatsTotal: 60,
    seatsTaken: 45,
  },
];

interface PersistedData {
  users: UserRecord[];
  userRoles: UserRoleRecord[];
  events: EventRecord[];
  registrations: RegistrationRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'afaq-db.json');

class DatabaseStore {
  private users: Map<string, UserRecord> = new Map();
  private userRoles: Map<string, UserRoleRecord> = new Map();
  private events: Map<string, EventRecord> = new Map();
  private registrations: Map<string, RegistrationRecord> = new Map();

  constructor() {
    this.load();
  }

  private load() {
    let loaded = false;
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: PersistedData = JSON.parse(raw);

        if (Array.isArray(parsed.users)) {
          for (const u of parsed.users) this.users.set(u.id, u);
        }
        if (Array.isArray(parsed.userRoles)) {
          for (const r of parsed.userRoles) this.userRoles.set(r.userId, r);
        }
        if (Array.isArray(parsed.events) && parsed.events.length > 0) {
          for (const e of parsed.events) this.events.set(e.id, e);
        } else {
          this.seedEvents();
        }
        if (Array.isArray(parsed.registrations)) {
          for (const r of parsed.registrations) this.registrations.set(r.id, r);
        }
        loaded = true;
      }
    } catch (err) {
      console.warn('Failed to load persisted DB, initializing fresh store:', err);
    }

    if (!loaded) {
      this.seedEvents();
    }

    // Ensure every existing user has a role row, and ensure the approved initial admin email has 'admin' role
    let roleChanged = false;
    for (const u of this.users.values()) {
      const isInitialAdmin = u.email.toLowerCase() === INITIAL_ADMIN_EMAIL.toLowerCase();
      const existingRole = this.userRoles.get(u.id);
      if (!existingRole) {
        this.userRoles.set(u.id, {
          userId: u.id,
          role: isInitialAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        });
        roleChanged = true;
      } else if (isInitialAdmin && existingRole.role !== 'admin') {
        existingRole.role = 'admin';
        roleChanged = true;
      }
    }

    if (!loaded || roleChanged) {
      this.save();
    }
  }

  private seedEvents() {
    for (const event of SEED_EVENTS) {
      this.events.set(event.id, { ...event });
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const payload: PersistedData = {
        users: Array.from(this.users.values()),
        userRoles: Array.from(this.userRoles.values()),
        events: Array.from(this.events.values()),
        registrations: Array.from(this.registrations.values()),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist DB:', err);
    }
  }

  // --- USERS & USER_ROLES TABLE QUERIES ---
  getUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): UserRecord | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  createOrUpdateUser(user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
  }): UserRecord {
    const existing = this.users.get(user.id);
    let dirty = false;

    if (existing) {
      if (user.name && existing.name !== user.name) {
        existing.name = user.name;
        dirty = true;
      }
      if (user.email && existing.email !== user.email) {
        existing.email = user.email;
        dirty = true;
      }
    } else {
      const newUser: UserRecord = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString(),
      };
      this.users.set(user.id, newUser);
      dirty = true;
    }

    // Ensure role record exists in user_roles table (default 'user', or 'admin' for initial verified admin email)
    const isInitialAdmin =
      user.emailVerified !== false &&
      user.email.toLowerCase() === INITIAL_ADMIN_EMAIL.toLowerCase();

    const existingRole = this.userRoles.get(user.id);
    if (!existingRole) {
      this.userRoles.set(user.id, {
        userId: user.id,
        role: isInitialAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      });
      dirty = true;
    } else if (isInitialAdmin && existingRole.role !== 'admin') {
      existingRole.role = 'admin';
      dirty = true;
    }

    if (dirty) {
      this.save();
    }

    return this.users.get(user.id)!;
  }

  /**
   * Server-side only role lookup from `user_roles` table.
   */
  getUserRole(userId: string): AppRole {
    return this.userRoles.get(userId)?.role ?? 'user';
  }

  // --- EVENTS TABLE QUERIES ---
  getPublishedEvents(filters?: {
    category?: string;
    organizer?: string;
    search?: string;
  }): EventRecord[] {
    const results: EventRecord[] = [];

    for (const event of this.events.values()) {
      if (event.status !== 'published') continue;

      if (filters?.category && filters.category !== 'all' && event.category !== filters.category) {
        continue;
      }

      if (filters?.organizer && filters.organizer !== 'all' && event.organizer !== filters.organizer) {
        continue;
      }

      if (filters?.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesOrg = event.organizer.toLowerCase().includes(q);
        const matchesLoc = event.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesLoc) {
          continue;
        }
      }

      results.push(event);
    }

    return results.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }

  getPublishedEventById(id: string): EventRecord | undefined {
    const event = this.events.get(id);
    if (!event || event.status !== 'published') {
      return undefined;
    }
    return event;
  }

  getDistinctOrganizers(): string[] {
    const organizers = new Set<string>();
    for (const event of this.events.values()) {
      if (event.status === 'published') {
        organizers.add(event.organizer);
      }
    }
    return Array.from(organizers).sort();
  }

  // --- ADMIN EVENTS & REGISTRATIONS QUERIES ---
  getAllEventsForAdmin(): EventRecord[] {
    return Array.from(this.events.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createEvent(data: Omit<EventRecord, 'id' | 'createdAt'>): EventRecord {
    const id = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: EventRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.events.set(id, newEvent);
    this.save();
    return newEvent;
  }

  updateEvent(id: string, patch: Partial<Omit<EventRecord, 'id' | 'createdAt'>>): EventRecord | null {
    const existing = this.events.get(id);
    if (!existing) return null;

    const updated: EventRecord = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    this.events.set(id, updated);
    this.save();
    return updated;
  }

  /**
   * Cascade Delete: Deleting an event deletes all associated registrations for good.
   */
  deleteEvent(id: string): boolean {
    if (!this.events.has(id)) return false;

    this.events.delete(id);

    for (const [regId, reg] of this.registrations.entries()) {
      if (reg.eventId === id) {
        this.registrations.delete(regId);
      }
    }

    this.save();
    return true;
  }

  getAllRegistrationsForAdmin(): Array<
    RegistrationRecord & { user?: UserRecord; event?: EventRecord }
  > {
    const results: Array<RegistrationRecord & { user?: UserRecord; event?: EventRecord }> = [];
    for (const reg of this.registrations.values()) {
      results.push({
        ...reg,
        user: this.users.get(reg.userId),
        event: this.events.get(reg.eventId),
      });
    }
    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- REGISTRATIONS TABLE QUERIES ---
  getUserRegistrations(userId: string): Array<RegistrationRecord & { event: EventRecord }> {
    const results: Array<RegistrationRecord & { event: EventRecord }> = [];

    for (const reg of this.registrations.values()) {
      if (reg.userId === userId) {
        const event = this.events.get(reg.eventId);
        if (event && event.status === 'published') {
          results.push({ ...reg, event });
        }
      }
    }

    return results.sort(
      (a, b) => new Date(a.event.startsAt).getTime() - new Date(b.event.startsAt).getTime()
    );
  }

  createRegistration(
    userId: string,
    eventId: string
  ): { success: boolean; registration?: RegistrationRecord; error?: string } {
    const event = this.events.get(eventId);
    if (!event || event.status !== 'published') {
      return { success: false, error: 'الفعالية غير موجودة أو غير متاحة للتسجيل حالياً' };
    }

    for (const reg of this.registrations.values()) {
      if (reg.userId === userId && reg.eventId === eventId) {
        return { success: false, error: 'أنت مسجّل بالفعل في هذه الفعالية ولا يمكن التسجيل مرتين.' };
      }
    }

    if (
      event.seatsTotal !== undefined &&
      event.seatsTaken !== undefined &&
      event.seatsTaken >= event.seatsTotal
    ) {
      return { success: false, error: 'عذراً، اكتملت المقاعد المتاحة في هذه الفعالية.' };
    }

    const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newReg: RegistrationRecord = {
      id,
      userId,
      eventId,
      createdAt: new Date().toISOString(),
    };

    this.registrations.set(id, newReg);

    if (event.seatsTaken !== undefined) {
      event.seatsTaken += 1;
    }

    this.save();
    return { success: true, registration: newReg };
  }

  cancelRegistration(
    userId: string,
    registrationId: string
  ): { success: boolean; statusCode: number; error?: string } {
    const reg = this.registrations.get(registrationId);
    if (!reg) {
      return { success: false, statusCode: 404, error: 'التسجيل غير موجود أو تم إلغاؤه مسبقاً.' };
    }

    if (reg.userId !== userId) {
      return { success: false, statusCode: 403, error: 'غير مصرح لك بإلغاء هذا التسجيل.' };
    }

    this.registrations.delete(registrationId);

    const event = this.events.get(reg.eventId);
    if (event && event.seatsTaken !== undefined && event.seatsTaken > 0) {
      event.seatsTaken -= 1;
    }

    this.save();
    return { success: true, statusCode: 200 };
  }
}

export const db = new DatabaseStore();
