import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './config/env.js';
import { errorHandler } from './presentation/middleware/error-handler.js';
import { authMiddleware, type AuthEnv } from './presentation/middleware/auth.js';
import { auth } from './presentation/routes/auth/auth.controller.js';
import { health } from './presentation/routes/health.controller.js';
import { user } from './presentation/routes/user/user.controller.js';

// 認証不要のルート
const publicApp = new Hono();
publicApp.route('/health', health);
publicApp.route('/auth', auth);

// 認証必須のルート
const protectedApp = new Hono<AuthEnv>();
protectedApp.use('*', authMiddleware);
protectedApp.route('/users', user);

// メインアプリ
const app = new Hono();
app.onError(errorHandler);

app.get('/', (c) => {
  return c.json({ name: 'OshiLock API', status: 'ok' });
});

app.route('/', publicApp);
app.route('/', protectedApp);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`OshiLock API running at http://localhost:${info.port}`);
});

export default app;
