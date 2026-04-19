import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./config/env.js";
import { health } from "./presentation/routes/health.controller.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ name: "OshiLock API", status: "ok" });
});

app.route("/health", health);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`OshiLock API running at http://localhost:${info.port}`);
});

export default app;
