// Module augmentation: add `locale` to Hono's ContextVariableMap so that
// `c.set('locale', ...)` / `c.var.locale` / `c.get('locale')` are all typed as Locale
// instead of `any`. Imported implicitly via tsconfig `"include": ["src/**/*"]`.

import type { Locale } from "../i18n";

declare module "hono" {
  interface ContextVariableMap {
    locale: Locale;
  }
}

// Ensure this file is treated as a module (so the `declare module` augmentation applies
// rather than becoming a global script).
export {};
