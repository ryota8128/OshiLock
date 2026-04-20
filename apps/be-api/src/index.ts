import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./config/env.js";
import { errorHandler } from "./presentation/middleware/error-handler.js";
import { auth } from "./presentation/routes/auth/auth.controller.js";
import { health } from "./presentation/routes/health.controller.js";

const app = new Hono();

app.onError(errorHandler);

app.get("/", (c) => {
  return c.json({ name: "OshiLock API", status: "ok" });
});

app.route("/auth", auth);
app.route("/health", health);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`OshiLock API running at http://localhost:${info.port}`);
});

export default app;
