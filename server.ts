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
   * Automatically creates or updates the user record in the `users` table on first login.
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
      const name =
        decodedToken.name ||
        (email ? email.split('@')[0] : '') ||
        'مستخدم آفاق';

      const userRecord = db.createOrUpdateUser({ id: uid, name, email });
      req.authUser = userRecord;
      next();
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return res.status(401).json({
        error: 'انتهت صلاحية الجلسة أو رمز التحقق غير صالح. يرجى تسجيل الدخول مجدداً.',
      });
    }
  };

  // --- API ROUTES ---

  /**
   * POST /api/auth/sync
   * Verifies Firebase session token and creates/returns the user record in `users` table.
   */
  app.post('/api/auth/sync', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: 'تعذر التحقق من هوية المستخدم.' });
    }
    return res.json({ user: req.authUser });
  });

  /**
   * GET /api/events
   * Access Rule: Visitors can ONLY read published events (status = published)
   */
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

  /**
   * GET /api/events/:id
   * Access Rule: Visitors can only read a specific published event
   */
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

  /**
   * GET /api/organizers
   * Returns distinct list of organizers from published events
   */
  app.get('/api/organizers', (_req: Request, res: Response) => {
    try {
      const organizers = db.getDistinctOrganizers();
      return res.json(organizers);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      return res.status(500).json({ error: 'فشل استرجاع الجهات المنظمة.' });
    }
  });

  /**
   * GET /api/registrations/my
   * Access Rule: Authenticated user reads ONLY their OWN registrations, nearest first.
   */
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

  /**
   * POST /api/registrations
   * Access Rule: Authenticated user registers. User ID is extracted from verified token ONLY.
   * Unique constraint prevents duplicate registration for the same event.
   */
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

  /**
   * DELETE /api/registrations/:id
   * Access Rule: Authenticated user cancels ONLY their OWN registration.
   */
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
