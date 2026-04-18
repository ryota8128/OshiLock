import { serve } from "@hono/node-server";
import { SourceReliability } from "@oshilock/shared";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ name: "OshiLock API", status: "ok" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

serve({ fetch: app.fetch, port: 3012 }, (info) => {
  console.log(`OshiLock API running at http://localhost:${info.port}`);
});

export default app;
