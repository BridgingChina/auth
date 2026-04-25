import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  webOrigin: string;
  locale: Locale;
};

export const VerifyEmailPage: FC<Props> = ({ webOrigin, locale }) => (
  <Layout
    title={t("auth.verify_email.title", locale)}
    scriptSrc="/static/verify-email.js"
    locale={locale}
  >
    <div class="auth-card">
      <h2 class="text-xl font-semibold text-[#1F1F1E] mb-6">
        {t("auth.verify_email.heading", locale)}
      </h2>

      {/* Hidden config element: client script reads webOrigin from here
          because Layout renders <body> and doesn't forward data-* props. */}
      <div id="config" data-web-origin={webOrigin} class="hidden"></div>

      <div id="loading" class="text-[#6E6B65] text-center hidden">
        {t("auth.verify_email.loading", locale)}
      </div>

      <div
        id="success"
        class="ds-alert-success"
      >
        <p id="success-message">{t("auth.verify_email.success", locale)}</p>
      </div>

      <div
        id="error"
        class="ds-alert-error hidden"
      >
        <p id="error-message">{t("auth.verify_email.error", locale)}</p>
      </div>

      <div class="pt-6 text-center">
        <a href="/auth/login" class="ds-link">
          {t("auth.verify_email.goto_signin", locale)}
        </a>
      </div>
    </div>
  </Layout>
);
