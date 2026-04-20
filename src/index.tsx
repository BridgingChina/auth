import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth, type Env } from "./auth";
import { localeMiddleware } from "./middleware/locale";
import { LoginPage } from "./ui/login";
import { RegisterPage } from "./ui/register";
import { ForgotPasswordPage } from "./ui/forgot-password";
import { ResetPasswordPage } from "./ui/reset-password";
import { MagicLinkPage } from "./ui/magic-link";
import { VerifyEmailPage } from "./ui/verify-email";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  return cors({
    origin: [c.env.WEB_ORIGIN, c.env.CONSOLE_ORIGIN, c.env.BETTER_AUTH_URL],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "x-captcha-response"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })(c, next);
});

// Locale middleware runs AFTER CORS so the OPTIONS preflight short-circuit in `cors()`
// still returns fast (no need to resolve locale for preflights). Sets `c.var.locale`
// for all downstream handlers.
app.use("*", localeMiddleware);

app.get("/health", (c) =>
  c.json({ ok: true, service: "auth", version: "0.1.0" })
);

// Better Auth handler (all /api/auth/* routes)
app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

// UI routes
app.get("/auth/login", (c) =>
  c.html(
    <LoginPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
      redirectTo={c.req.query("redirect_to")}
    />
  )
);

app.get("/auth/register", (c) =>
  c.html(
    <RegisterPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
    />
  )
);

app.get("/auth/forgot-password", (c) =>
  c.html(<ForgotPasswordPage siteKey={c.env.TURNSTILE_SITE_KEY} />)
);

app.get("/auth/reset-password", (c) => c.html(<ResetPasswordPage />));

app.get("/auth/magic-link", (c) =>
  c.html(
    <MagicLinkPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
    />
  )
);

app.get("/auth/verify-email", (c) =>
  c.html(<VerifyEmailPage webOrigin={c.env.WEB_ORIGIN} />)
);

// Root: redirect to login (better than 404 for stray navigations after magic-link)
app.get("/", (c) => c.redirect(`${c.env.WEB_ORIGIN}`, 302));

export default app;
