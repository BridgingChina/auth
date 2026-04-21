// Bilingual email HTML templates for verify-email / reset-password / magic-link.
//
// Kept inline (no React Email) because the auth Worker runs on Cloudflare's V8
// isolate — no Node, no ReactDOMServer. Each template is a tiny pure function
// that produces HTML; locale flows in explicitly from auth.ts callbacks which
// resolve `user.preferredLocale` (falling back to DEFAULT_LOCALE).

import { t, type Locale } from "./i18n";

function escape(s: string): string {
  // Minimal HTML escape for interpolated user-provided values.
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shell(opts: {
  locale: Locale;
  heading: string;
  body: string;
  cta: string;
  url: string;
}): string {
  const { locale, heading, body, cta, url } = opts;
  const brand = t("layout.brand", locale);
  const safeUrl = escape(url);
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${escape(heading)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; padding: 32px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="color: #1e293b; margin: 0 0 16px; font-size: 20px;">${escape(brand)}</h1>
    <h2 style="color: #334155; margin: 0 0 24px; font-size: 16px; font-weight: 600;">${escape(heading)}</h2>
    <p style="color: #475569; line-height: 1.6; margin: 0 0 24px;">${escape(body)}</p>
    <p style="margin: 0 0 24px;">
      <a href="${safeUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">${escape(cta)}</a>
    </p>
    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 24px 0 0; word-break: break-all;">
      ${safeUrl}
    </p>
  </div>
</body>
</html>`;
}

export function verifyEmailHtml(locale: Locale, url: string): string {
  return shell({
    locale,
    heading: t("email.verify.heading", locale),
    body: t("email.verify.body", locale),
    cta: t("email.verify.cta", locale),
    url,
  });
}

export function resetPasswordHtml(locale: Locale, url: string): string {
  return shell({
    locale,
    heading: t("email.reset.heading", locale),
    body: t("email.reset.body", locale),
    cta: t("email.reset.cta", locale),
    url,
  });
}

export function magicLinkHtml(locale: Locale, url: string): string {
  return shell({
    locale,
    heading: t("email.magic.heading", locale),
    body: t("email.magic.body", locale),
    cta: t("email.magic.cta", locale),
    url,
  });
}
