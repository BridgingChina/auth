// i18n entry point. Exports:
//   - LOCALES / Locale / DEFAULT_LOCALE  — supported locales
//   - MessageKey                          — union of all translation keys (from zh-CN)
//   - resolveLocale(tag)                  — narrow any string to a Locale (fallback to default)
//   - t(key, locale, params?)             — look up translation, interpolate {{params}},
//                                           fall back to DEFAULT_LOCALE on miss, then key
//
// zh-CN is the source of truth for MessageKey; en-US is type-checked against it.
// Adding a new key: add to zh-CN.ts first, then TS will force you to add it to en-US.ts.

import { zhCN } from "./zh-CN";
import { enUS } from "./en-US";

export const LOCALES = ["zh-CN", "en-US"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh-CN";

// MessageKey is derived from zhCN so parity is enforced at compile time.
export type MessageKey = keyof typeof zhCN;

const REGISTRY: Record<Locale, Record<MessageKey, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

/**
 * Normalize an arbitrary locale tag (from cookie / header / user input) to a supported Locale.
 * Unknown tags fall back to DEFAULT_LOCALE. Case-sensitive on purpose — callers should pass
 * canonical BCP-47 tags like "zh-CN", not "zh_CN" or "zh-cn".
 */
export function resolveLocale(tag: string | null | undefined): Locale {
  if (!tag) return DEFAULT_LOCALE;
  return (LOCALES as readonly string[]).includes(tag)
    ? (tag as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Translate a MessageKey for a given locale, interpolating `{{name}}` placeholders.
 *
 * Fallback chain: target locale → DEFAULT_LOCALE → raw key string. In practice the
 * DEFAULT_LOCALE fallback is unreachable because Record<MessageKey, string> forces
 * both dicts to be complete, but we keep the guard so the function never throws.
 */
export function t(
  key: MessageKey,
  locale: Locale,
  params?: Record<string, string>,
): string {
  let tmpl: string =
    REGISTRY[locale][key] ?? REGISTRY[DEFAULT_LOCALE][key] ?? (key as string);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      tmpl = tmpl.replaceAll(`{{${k}}}`, v);
    }
  }
  return tmpl;
}
