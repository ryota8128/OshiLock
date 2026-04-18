import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ name: "OshiLock API", status: "ok" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
