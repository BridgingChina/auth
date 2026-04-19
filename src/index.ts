import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth, type Env } from "./auth";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  return cors({
    origin: [c.env.WEB_ORIGIN, c.env.CONSOLE_ORIGIN, c.env.BETTER_AUTH_URL],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "x-captcha-response"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })(c, next);
});

app.get("/health", (c) =>
  c.json({ ok: true, service: "auth", version: "0.0.1" })
);

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default app;
