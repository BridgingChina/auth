import { Hono } from "hono";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";
import { createAuth, type Env } from "./auth";
import { localeMiddleware } from "./middleware/locale";
import { LOCALES, type Locale } from "./i18n";
import { LoginPage } from "./ui/login";
import { RegisterPage } from "./ui/register";
import { ForgotPasswordPage } from "./ui/forgot-password";
import { ResetPasswordPage } from "./ui/reset-password";
import { MagicLinkPage } from "./ui/magic-link";
import { VerifyEmailPage } from "./ui/verify-email";

const app = new Hono<{ Bindings: Env; Variables: { locale: Locale } }>();

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

// --- UI routes ---

app.get("/auth/login", (c) =>
  c.html(
    <LoginPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
      redirectTo={c.req.query("redirect_to")}
      locale={c.var.locale}
    />
  )
);

app.get("/auth/register", (c) =>
  c.html(
    <RegisterPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
      locale={c.var.locale}
    />
  )
);

app.get("/auth/forgot-password", (c) =>
  c.html(
    <ForgotPasswordPage siteKey={c.env.TURNSTILE_SITE_KEY} locale={c.var.locale} />
  )
);

app.get("/auth/reset-password", (c) =>
  c.html(<ResetPasswordPage locale={c.var.locale} />)
);

app.get("/auth/magic-link", (c) =>
  c.html(
    <MagicLinkPage
      siteKey={c.env.TURNSTILE_SITE_KEY}
      webOrigin={c.env.WEB_ORIGIN}
      locale={c.var.locale}
    />
  )
);

app.get("/auth/verify-email", (c) =>
  c.html(<VerifyEmailPage webOrigin={c.env.WEB_ORIGIN} locale={c.var.locale} />)
);

// --- Language switcher ---
//
// POST /auth/locale { locale, next } — flips the NEXT_LOCALE cookie and redirects
// back to `next` (defaulting to /auth/login). The cookie is host-scoped (no
// Domain=) on purpose: the auth UI is a separate surface from the web/ app,
// and cookie-jar priority is NEXT_LOCALE on bridgingchina.net set by web/
// independently. Users who want a system-wide switch use the corresponding
// switcher on web/.
app.post("/auth/locale", async (c) => {
  const form = await c.req.formData();
  const requested = String(form.get("locale") ?? "");
  const next = String(form.get("next") ?? "/auth/login");
  const locale: Locale = (LOCALES as readonly string[]).includes(requested)
    ? (requested as Locale)
    : "zh-CN";

  setCookie(c, "NEXT_LOCALE", locale, {
    path: "/",
    secure: c.env.BETTER_AUTH_URL.startsWith("https://"),
    sameSite: "Lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });

  // Only allow redirect to local /auth/* paths to prevent open-redirect via
  // a manipulated `next` form value.
  const safeNext = next.startsWith("/auth/") ? next : "/auth/login";
  return c.redirect(safeNext, 302);
});

// Root: redirect to login (better than 404 for stray navigations after magic-link)
app.get("/", (c) => c.redirect(`${c.env.WEB_ORIGIN}`, 302));

export default app;
