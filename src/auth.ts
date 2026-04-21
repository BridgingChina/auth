import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins/username";
import { magicLink } from "better-auth/plugins/magic-link";
import { jwt } from "better-auth/plugins/jwt";
// NOTE: `captcha` is NOT exposed under `better-auth/plugins/captcha` in 1.6.5's
// package.json `exports`. It's only re-exported from the aggregated `better-auth/plugins`
// barrel. See node_modules/better-auth/package.json — the `plugins/captcha` subpath
// is absent. Plan said `better-auth/plugins/captcha`; adjusted to match reality.
import { captcha } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { sendEmail } from "./email";
import {
  verifyEmailHtml,
  resetPasswordHtml,
  magicLinkHtml,
} from "./email-templates";
import { t, DEFAULT_LOCALE, LOCALES, type Locale } from "./i18n";

// Better Auth's callbacks receive `user` but not the locale from the request.
// The user's `preferredLocale` column (populated by Phase 1 schema migration)
// is the only locale signal available — default to zh-CN when absent or unknown.
function resolveUserLocale(user: { preferredLocale?: string | null }): Locale {
  const tag = user.preferredLocale;
  if (tag && (LOCALES as readonly string[]).includes(tag)) {
    return tag as Locale;
  }
  return DEFAULT_LOCALE;
}

export type Env = {
  AUTH_DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  WEB_ORIGIN: string;
  CONSOLE_ORIGIN: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY: string;
  INTERNAL_WEBHOOK_SECRET: string;
};

export function createAuth(env: Env) {
  const db = drizzle(env.AUTH_DB, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        jwks: schema.jwks,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: [env.BETTER_AUTH_URL, env.WEB_ORIGIN, env.CONSOLE_ORIGIN],
    advanced: {
      crossSubDomainCookies: { enabled: true, domain: ".bridgingchina.net" },
      useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
    },
    user: {
      additionalFields: {
        role: { type: "string", required: true, defaultValue: "user" },
        isActive: { type: "boolean", required: true, defaultValue: true },
        passwordChangedAt: { type: "date", required: false },
        // preferredLocale: surfaced to clients via session.user.preferredLocale and
        // embedded in JWT payload as `preferred_locale` (see jwt plugin config below)
        // so FastAPI can localize error messages without a second round-trip.
        preferredLocale: {
          type: "string",
          required: true,
          defaultValue: "zh-CN",
        },
      },
      deleteUser: { enabled: true },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 12,
      resetPasswordTokenExpiresIn: 900,
      sendResetPassword: async ({ user, url }) => {
        const locale = resolveUserLocale(user as unknown as { preferredLocale?: string | null });
        await sendEmail({
          to: user.email,
          subject: t("email.reset.subject", locale),
          html: resetPasswordHtml(locale, url),
          apiKey: env.RESEND_API_KEY,
        });
      },
    },
    emailVerification: {
      expiresIn: 900,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        const locale = resolveUserLocale(user as unknown as { preferredLocale?: string | null });
        await sendEmail({
          to: user.email,
          subject: t("email.verify.subject", locale),
          html: verifyEmailHtml(locale, url),
          apiKey: env.RESEND_API_KEY,
        });
      },
    },
    plugins: [
      username(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          // Magic-link callback only gets `email`, not the full user row — so
          // we can't read preferredLocale here. Default to zh-CN; users who
          // want English magic-link emails can hit the UI in English first
          // (which writes NEXT_LOCALE cookie) and register from there to
          // populate preferredLocale.
          const locale: Locale = DEFAULT_LOCALE;
          await sendEmail({
            to: email,
            subject: t("email.magic.subject", locale),
            html: magicLinkHtml(locale, url),
            apiKey: env.RESEND_API_KEY,
          });
        },
      }),
      jwt({
        jwt: {
          expirationTime: "15m",
          issuer: env.BETTER_AUTH_URL,
          audience: "fastapi",
          // Extend payload with role + preferred_locale so resource servers (FastAPI)
          // can authorize + localize without a round-trip to /api/auth/me.
          //
          // IMPORTANT: Better Auth's jwt plugin REPLACES the payload with whatever
          // definePayload returns (see node_modules/better-auth/dist/plugins/jwt/sign.mjs:53
          // — `payload = await options.jwt.definePayload(ctx.context.session)`). The plugin
          // only re-adds `sub`, `iat`, `iss`, `aud`, `exp` afterwards; every other user
          // field (email, emailVerified, name, isActive, ...) is dropped unless we
          // explicitly include it. FastAPI's `CurrentUser.from_payload` reads
          // `payload["email"]` and will 401 on a payload without it, so we spread the
          // full user object first and then overlay the two extra claims.
          definePayload: (ctx) => ({
            ...ctx.user,
            role: (ctx.user as { role?: string }).role ?? "user",
            preferred_locale:
              (ctx.user as { preferredLocale?: string }).preferredLocale ??
              "zh-CN",
          }),
        },
      }),
      captcha({
        provider: "cloudflare-turnstile",
        secretKey: env.TURNSTILE_SECRET_KEY,
        endpoints: ["/sign-up/email", "/sign-in/email", "/sign-in/username", "/request-password-reset"],
      }),
    ],
    rateLimit: {
      enabled: true,
      window: 3600,
      max: 10,
      storage: "database",
      customRules: {
        "/sign-up/email": { window: 3600, max: 5 },
        "/request-password-reset": { window: 3600, max: 3 },
      },
    },
  });
}
