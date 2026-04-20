// Hono middleware that resolves the request locale and stashes it on `c.var.locale`.
//
// Resolution precedence (first match wins):
//   1. NEXT_LOCALE cookie     — set by the web/ frontend's language switcher
//   2. Accept-Language header — first recognized tag
//   3. DEFAULT_LOCALE         — zh-CN
//
// Cookie name matches Next.js i18n convention so web/ and auth/ can share it without a
// separate sync layer. Downstream handlers read `c.var.locale` (typed via
// src/types/hono.d.ts ContextVariableMap extension).

import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import {
  resolveLocale,
  LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from "../i18n";

const COOKIE_NAME = "NEXT_LOCALE";

export const localeMiddleware: MiddlewareHandler = async (c, next) => {
  const cookieLocale = getCookie(c, COOKIE_NAME);
  let locale: Locale = DEFAULT_LOCALE;

  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale as Locale;
  } else {
    const header = c.req.header("accept-language");
    if (header) {
      // Accept-Language is a comma-separated list of tags with optional q-weights,
      // e.g. "zh-CN,zh;q=0.9,en-US;q=0.8". We walk left-to-right and take the first
      // exact match — quality weights are ignored on purpose (browsers already order
      // by descending quality).
      for (const part of header.split(",")) {
        const tag = part.split(";")[0].trim();
        if ((LOCALES as readonly string[]).includes(tag)) {
          locale = tag as Locale;
          break;
        }
      }
    }
  }

  // resolveLocale() is a defensive pass in case future code ever assigns an unverified
  // string to `locale`. Currently a no-op given the guards above.
  c.set("locale", resolveLocale(locale));
  await next();
};
