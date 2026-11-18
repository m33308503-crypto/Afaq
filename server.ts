import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, UserRecord } from './src/server/db.ts';
import { adminAuth } from './src/server/firebase-admin.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthenticatedRequest extends Request {
  authUser?: UserRecord;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  /**
   * Auth Middleware:
   * Verifies Firebase ID token from Authorization: Bearer <token> header.
   * Never trusts any user_id or role sent from the browser.
   */
  const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'غير مصرح: يرجى تسجيل الدخول أولاً.' });
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      return res.status(401).json({ error: 'رمز الجلسة غير موجود.' });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const uid = decodedToken.uid;
      const email = decodedToken.email || '';
      const emailVerified = Boolean(decodedToken.email_verified);
      const name =
        decodedToken.name ||
        (email ? email.split('@')[0] : '') ||
        'مستخدم آفاق';

      const userRecord = db.createOrUpdateUser({ id: uid, name, email, emailVerified });
      req.authUser = userRecord;
      next();
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return res.status(401).json({
        error: 'انتهت صلاحية الجلسة أو رمز التحقق غير صالح. يرجى تسجيل الدخول مجدداً.',
      });
    }
  };

  /**
   * Admin Middleware:
   * Always reads the user's role from the `user_roles` table on the server.
   * Rejects any non-admin with 403 Forbidden.
   */
  const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.authUser) {
      return res.status(401).json({ error: 'غير مصرح: يرجى تسجيل الدخول أولاً.' });
    }

    const role = db.getUserRole(req.authUser.id);
    if (role !== 'admin') {
      return res.status(403).json({
        error: 'غير مصرّح: هذه الصفحة والعمليات مخصصة لمسؤولي المنصة فقط.',
      });
    }

    next();
  };

  // --- AUTH ROUTES ---

  /**
   * POST /api/auth/sync
   * Verifies Firebase session token and creates/returns the user record in `users` table.
   * Note: Role is intentionally NOT returned or stored in client user profile.
   */
  app.post('/api/auth/sync', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: 'تعذر التحقق من هوية المستخدم.' });
    }
    return res.json({ user: req.authUser });
  });

  // --- PUBLIC ROUTES ---

  app.get('/api/events', (req: Request, res: Response) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const organizer = typeof req.query.organizer === 'string' ? req.query.organizer : undefined;
      const q = typeof req.query.q === 'string' ? req.query.q : undefined;

      const events = db.getPublishedEvents({ category, organizer, search: q });
      return res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'فشل استرجاع الفعاليات من الخادم.' });
    }
  });

  app.get('/api/events/:id', (req: Request, res: Response) => {
    try {
      const event = db.getPublishedEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'الفعالية غير موجودة أو غير منشورة.' });
      }
      return res.json(event);
    } catch (error) {
      console.error('Error fetching event by id:', error);
      return res.status(500).json({ error: 'فشل استرجاع بيانات الفعالية.' });
    }
  });

  app.get('/api/organizers', (_req: Request, res: Response) => {
    try {
      const organizers = db.getDistinctOrganizers();
      return res.json(organizers);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      return res.status(500).json({ error: 'فشل استرجاع الجهات المنظمة.' });
    }
  });

  // --- ATTENDEE PROTECTED ROUTES ---

  app.get(
    '/api/registrations/my',
    authenticateUser,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const currentUser = req.authUser!;
        const userRegistrations = db.getUserRegistrations(currentUser.id);
        return res.json(userRegistrations);
      } catch (error) {
        console.error('Error fetching user registrations:', error);
        return res.status(500).json({ error: 'فشل استرجاع تسجيلاتك.' });
      }
    }
  );

  app.post(
    '/api/registrations',
    authenticateUser,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const currentUser = req.authUser!;
        const { eventId } = req.body;

        if (!eventId || typeof eventId !== 'string') {
          return res.status(400).json({ error: 'معرّف الفعالية إجباري.' });
        }

        const result = db.createRegistration(currentUser.id, eventId);
        if (!result.success) {
          return res.status(409).json({ error: result.error });
        }

        return res.status(201).json(result.registration);
      } catch (error) {
        console.error('Error creating registration:', error);
        return res.status(500).json({ error: 'فشل إتمام التسجيل.' });
      }
    }
  );

  app.delete(
    '/api/registrations/:id',
    authenticateUser,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const currentUser = req.authUser!;
        const registrationId = req.params.id;

        if (!registrationId) {
          return res.status(400).json({ error: 'معرّف التسجيل مطلوب.' });
        }

        const result = db.cancelRegistration(currentUser.id, registrationId);
        if (!result.success) {
          return res.status(result.statusCode).json({ error: result.error });
        }

        return res.json({ message: 'تم إلغاء التسجيل بنجاح.' });
      } catch (error) {
        console.error('Error cancelling registration:', error);
        return res.status(500).json({ error: 'تعذر إلغاء التسجيل، يرجى المحاولة مرة أخرى.' });
      }
    }
  );

  // --- ADMIN PROTECTED ROUTES (Every route verifies session + user_roles.role === 'admin') ---

  app.get(
    '/api/admin/access',
    authenticateUser,
    requireAdmin,
    (_req: AuthenticatedRequest, res: Response) => {
      return res.json({ authorized: true });
    }
  );

  app.get(
    '/api/admin/events',
    authenticateUser,
    requireAdmin,
    (_req: AuthenticatedRequest, res: Response) => {
      try {
        const allEvents = db.getAllEventsForAdmin();
        return res.json(allEvents);
      } catch (error) {
        console.error('Admin fetch events failed:', error);
        return res.status(500).json({ error: 'فشل استرجاع الفعاليات.' });
      }
    }
  );

  app.post(
    '/api/admin/events',
    authenticateUser,
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const {
          title,
          description,
          category,
          startsAt,
          dateLabel,
          timeLabel,
          location,
          organizer,
          coverImageUrl,
          status,
        } = req.body || {};

        if (!title || !description || !category || !startsAt || !location || !organizer) {
          return res.status(400).json({ error: 'يرجى تعبئة جميع الحقول الإجبارية للفعالية.' });
        }

        if (!['workshop', 'course', 'event'].includes(category)) {
          return res.status(400).json({ error: 'تصنيف الفعالية غير صالح.' });
        }

        const safeStatus = ['draft', 'published', 'hidden'].includes(status)
          ? status
          : 'draft';

        const created = db.createEvent({
          title: String(title).trim(),
          description: String(description).trim(),
          category,
          startsAt: String(startsAt),
          dateLabel: dateLabel ? String(dateLabel) : String(startsAt),
          timeLabel: timeLabel ? String(timeLabel) : undefined,
          location: String(location).trim(),
          organizer: String(organizer).trim(),
          coverImageUrl: coverImageUrl ? String(coverImageUrl).trim() : undefined,
          status: safeStatus,
        });

        return res.status(201).json(created);
      } catch (error) {
        console.error('Admin create event failed:', error);
        return res.status(500).json({ error: 'تعذر إنشاء الفعالية.' });
      }
    }
  );

  app.put(
    '/api/admin/events/:id',
    authenticateUser,
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const body = req.body || {};
        const patch: Record<string, unknown> = {};

        if (typeof body.title === 'string' && body.title.trim()) patch.title = body.title.trim();
        if (typeof body.description === 'string') patch.description = body.description.trim();
        if (typeof body.category === 'string') {
          if (!['workshop', 'course', 'event'].includes(body.category)) {
            return res.status(400).json({ error: 'تصنيف الفعالية غير صالح.' });
          }
          patch.category = body.category;
        }
        if (typeof body.startsAt === 'string' && body.startsAt.trim()) {
          patch.startsAt = body.startsAt.trim();
        }
        if (typeof body.dateLabel === 'string') patch.dateLabel = body.dateLabel.trim();
        if (typeof body.timeLabel === 'string') patch.timeLabel = body.timeLabel.trim();
        if (typeof body.location === 'string' && body.location.trim()) {
          patch.location = body.location.trim();
        }
        if (typeof body.organizer === 'string' && body.organizer.trim()) {
          patch.organizer = body.organizer.trim();
        }
        if (typeof body.coverImageUrl === 'string') {
          patch.coverImageUrl = body.coverImageUrl.trim() || undefined;
        }
        if (typeof body.status === 'string') {
          if (!['draft', 'published', 'hidden'].includes(body.status)) {
            return res.status(400).json({ error: 'حالة الفعالية غير صالحة.' });
          }
          patch.status = body.status;
        }

        const updated = db.updateEvent(req.params.id, patch);
        if (!updated) {
          return res.status(404).json({ error: 'الفعالية غير موجودة.' });
        }
        return res.json(updated);
      } catch (error) {
        console.error('Admin update event failed:', error);
        return res.status(500).json({ error: 'تعذر تحديث الفعالية.' });
      }
    }
  );

  app.delete(
    '/api/admin/events/:id',
    authenticateUser,
    requireAdmin,
    (req: AuthenticatedRequest, res: Response) => {
      try {
        const deleted = db.deleteEvent(req.params.id);
        if (!deleted) {
          return res.status(404).json({ error: 'الفعالية غير موجودة.' });
        }
        return res.json({ message: 'تم حذف الفعالية وجميع تسجيلاتها بنجاح.' });
      } catch (error) {
        console.error('Admin delete event failed:', error);
        return res.status(500).json({ error: 'تعذر حذف الفعالية.' });
      }
    }
  );

  app.get(
    '/api/admin/registrations',
    authenticateUser,
    requireAdmin,
    (_req: AuthenticatedRequest, res: Response) => {
      try {
        const allRegistrations = db.getAllRegistrationsForAdmin();
        return res.json(allRegistrations);
      } catch (error) {
        console.error('Admin fetch registrations failed:', error);
        return res.status(500).json({ error: 'تعذر استرجاع قائمة التسجيلات.' });
      }
    }
  );

  // --- VITE MIDDLEWARE ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
