import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { env } from './config/env.js';
import { errorHandler } from './presentation/middleware/error-handler.js';
import { authMiddleware } from './presentation/middleware/auth.js';
import { internalAuthMiddleware } from './presentation/middleware/internal-auth.js';
import { auth } from './presentation/routes/auth/auth.controller.js';
import { health } from './presentation/routes/health.controller.js';
import { user } from './presentation/routes/user/user.controller.js';
import { post } from './presentation/routes/post/post.controller.js';
import { internal } from './presentation/routes/internal/internal.controller.js';

const app = new Hono();
app.use('*', logger());
app.onError(errorHandler);

app.get('/', (c) => c.json({ name: 'OshiLock API', status: 'ok' }));

// --- Public（認証なし） ---
app.route('/health', health);
app.route('/auth', auth);

// --- Protected（Firebase Auth） ---
app.use('/users/*', authMiddleware);
app.route('/users', user);

app.use('/posts/*', authMiddleware);
app.route('/posts', post);

// --- Internal（API Key） ---
app.use('/internal/*', internalAuthMiddleware);
app.route('/internal', internal);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`OshiLock API running at http://localhost:${info.port}`);
});

export default app;
