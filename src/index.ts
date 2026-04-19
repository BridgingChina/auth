import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("auth.bridgingchina.net is alive"));
app.get("/health", (c) =>
  c.json({ ok: true, service: "auth", version: "0.0.1" })
);

export default app;
