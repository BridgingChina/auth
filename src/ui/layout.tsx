import type { FC, PropsWithChildren } from "hono/jsx";
import { t, type Locale } from "../i18n";

type Props = PropsWithChildren<{
  title: string;
  scriptSrc?: string;
  locale: Locale;
}>;

export const Layout: FC<Props> = ({ title, scriptSrc, locale, children }) => (
  <html lang={locale}>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${title} · ${t("layout.brand", locale)}`}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="flex justify-end mb-2 text-xs text-slate-500">
          <form action="/auth/locale" method="post" class="flex gap-2 items-center">
            <input type="hidden" name="next" value="" data-current-path />
            {locale === "zh-CN" ? (
              <>
                <span class="font-medium text-slate-700">
                  {t("layout.lang_zh", locale)}
                </span>
                <button
                  type="submit"
                  name="locale"
                  value="en-US"
                  class="hover:text-blue-600 underline"
                >
                  {t("layout.lang_en", locale)}
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  name="locale"
                  value="zh-CN"
                  class="hover:text-blue-600 underline"
                >
                  {t("layout.lang_zh", locale)}
                </button>
                <span class="font-medium text-slate-700">
                  {t("layout.lang_en", locale)}
                </span>
              </>
            )}
          </form>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-6 text-center">
          {t("layout.brand", locale)}
        </h1>
        {children}
      </div>
      {/* Populate the language-switch form's `next` input with current path so
          the handler can redirect back after flipping the cookie. */}
      <script src="/static/locale-switcher.js" defer></script>
      {scriptSrc ? <script src={scriptSrc} defer></script> : null}
    </body>
  </html>
);
