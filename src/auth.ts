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
        await sendEmail({
          to: user.email,
          subject: "重置你的桥知账户密码",
          html: `<p>点击链接重置密码（15 分钟内有效）:</p><p><a href="${url}">${url}</a></p>`,
          apiKey: env.RESEND_API_KEY,
        });
      },
    },
    emailVerification: {
      expiresIn: 900,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "验证你的桥知邮箱",
          html: `<p>欢迎加入桥知！点此验证邮箱（15 分钟内有效）:</p><p><a href="${url}">${url}</a></p>`,
          apiKey: env.RESEND_API_KEY,
        });
      },
    },
    plugins: [
      username(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendEmail({
            to: email,
            subject: "桥知 Magic Link 登录",
            html: `<p>点击下方链接登录（5 分钟内有效）:</p><p><a href="${url}">${url}</a></p>`,
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
          // can authorize + localize without a round-trip to /api/auth/me. The base
          // payload still includes `sub`, `iss`, `aud`, `exp`, `iat` etc. from the
          // plugin — definePayload is merged on top, not replacing. See
          // node_modules/better-auth/dist/plugins/jwt/sign.mjs for merge logic.
          definePayload: (ctx) => ({
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
