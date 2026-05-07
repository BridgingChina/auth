import type { FC, PropsWithChildren } from "hono/jsx";
import { t, type Locale } from "../i18n";

type Props = PropsWithChildren<{
  title: string;
  scriptSrc?: string;
  locale: Locale;
}>;

const BRAND_TOKENS = `
  :root {
    --songci-celadon: #2C5F5D;
    --songci-celadon-deep: #1F4A48;
    --songci-celadon-soft: #5C8583;
    --vermilion: #B73E3E;
    --vermilion-deep: #9E2929;
    --yellow-hemp: #C9A875;
    --ink-black: #1F1F1E;
    --ink-black-soft: #3A3A38;
    --xuan-white: #F8F5EE;
    --rice-paper: #FBF9F4;
    --stone-grey: #E5E1D8;
    --stone-grey-deep: #9C9890;
    --ash: #6E6B65;
  }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background: #F8F5EE;
    color: #1F1F1E;
    font-family: "Inter", "Geist", system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  }

  .brand-mark {
    font-family: "Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", Georgia, serif;
    color: #2C5F5D;
  }

  /* Auth card */
  .auth-card {
    background: #FBF9F4;
    border: 1px solid #E5E1D8;
    border-radius: 10px;
    padding: 2rem;
  }

  /* Input */
  .ds-input {
    width: 100%;
    background: #FBF9F4;
    color: #1F1F1E;
    border: 1px solid #E5E1D8;
    border-radius: 8px;
    padding: 10px 14px;
    height: 44px;
    font-family: "Inter", "Geist", system-ui, "PingFang SC", sans-serif;
    font-size: 15px;
    line-height: 1.5;
    transition: background 150ms cubic-bezier(0.25, 1, 0.5, 1),
                border-color 150ms cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ds-input::placeholder { color: #9C9890; }
  .ds-input:focus {
    outline: none;
    background: #F8F5EE;
    border-color: #2C5F5D;
    box-shadow: 0 0 0 3px rgba(44, 95, 93, 0.2);
  }

  /* Primary button */
  .ds-btn-primary {
    display: block;
    width: 100%;
    background: #1F1F1E;
    color: #F8F5EE;
    border: none;
    border-radius: 8px;
    padding: 11px 24px;
    height: 44px;
    font-family: "Inter", "Geist", system-ui, "PingFang SC", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 220ms cubic-bezier(0.25, 1, 0.5, 1),
                transform 220ms cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 220ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ds-btn-primary:hover {
    background: #2C5F5D;
    transform: translateY(-1px);
    box-shadow: 0 1px 2px rgba(31, 31, 30, 0.04), 0 4px 12px rgba(31, 31, 30, 0.06);
  }
  .ds-btn-primary:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 95, 93, 0.2);
  }
  .ds-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Secondary link-button */
  .ds-btn-secondary {
    display: block;
    width: 100%;
    background: #F8F5EE;
    color: #1F1F1E;
    border: 1px solid #E5E1D8;
    border-radius: 8px;
    padding: 11px 24px;
    height: 44px;
    font-family: "Inter", "Geist", system-ui, "PingFang SC", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background 220ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ds-btn-secondary:hover { background: #E5E1D8; }
  .ds-btn-secondary:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 95, 93, 0.2);
  }

  /* Ghost link */
  .ds-link {
    color: #6E6B65;
    text-decoration: none;
    font-size: 13px;
    transition: color 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ds-link:hover { color: #1F4A48; }
  .ds-link:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 95, 93, 0.2);
    border-radius: 2px;
  }

  /* Feedback panels */
  .ds-alert-success {
    background: #FBF9F4;
    border: 1px solid #E5E1D8;
    border-radius: 8px;
    padding: 14px 16px;
    font-size: 14px;
    color: #1F4A48;
  }
  .ds-alert-error {
    background: #FBF9F4;
    border: 1px solid #B73E3E;
    border-radius: 8px;
    padding: 14px 16px;
    font-size: 14px;
    color: #9E2929;
  }

  /* Inline error text under inputs */
  .ds-field-error {
    font-size: 13px;
    color: #9E2929;
  }

  /* Divider */
  .ds-divider {
    border: none;
    border-top: 1px solid #E5E1D8;
    margin: 20px 0;
  }

  /* Language switcher button */
  .lang-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 12px;
    color: #6E6B65;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .lang-btn:hover { color: #1F4A48; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const Layout: FC<Props> = ({ title, scriptSrc, locale, children }) => (
  <html lang={locale}>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${title} · ${t("layout.brand", locale)}`}</title>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-icon.png" />
      <script src="https://cdn.tailwindcss.com"></script>
      <style dangerouslySetInnerHTML={{ __html: BRAND_TOKENS }} />
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="flex justify-end mb-3 text-xs text-[#6E6B65]">
          <form action="/auth/locale" method="post" class="flex gap-3 items-center">
            <input type="hidden" name="next" value="" data-current-path />
            {locale === "zh-CN" ? (
              <>
                <span class="font-medium text-[#1F1F1E] text-xs">
                  {t("layout.lang_zh", locale)}
                </span>
                <button
                  type="submit"
                  name="locale"
                  value="en-US"
                  class="lang-btn"
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
                  class="lang-btn"
                >
                  {t("layout.lang_zh", locale)}
                </button>
                <span class="font-medium text-[#1F1F1E] text-xs">
                  {t("layout.lang_en", locale)}
                </span>
              </>
            )}
          </form>
        </div>
        <h1 class="brand-mark text-3xl font-semibold mb-6 text-center tracking-wide">
          {t("layout.brand", locale)}
        </h1>
        {children}
      </div>
      {/* Populate the language-switch form's next input with current path so
          the handler can redirect back after flipping the cookie. */}
      <script src="/static/locale-switcher.js" defer></script>
      {scriptSrc ? <script src={scriptSrc} defer></script> : null}
    </body>
  </html>
);
