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
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-6">
        {t("auth.verify_email.heading", locale)}
      </h2>

      {/* Hidden config element: client script reads webOrigin from here
          because Layout renders <body> and doesn't forward data-* props. */}
      <div id="config" data-web-origin={webOrigin} class="hidden"></div>

      <div id="loading" class="text-slate-600 text-center hidden">
        {t("auth.verify_email.loading", locale)}
      </div>

      <div
        id="success"
        class="text-green-700 bg-green-50 border border-green-200 rounded p-4"
      >
        <p id="success-message">{t("auth.verify_email.success", locale)}</p>
      </div>

      <div
        id="error"
        class="text-red-700 bg-red-50 border border-red-200 rounded p-4 hidden"
      >
        <p id="error-message">{t("auth.verify_email.error", locale)}</p>
      </div>

      <div class="pt-6 text-sm text-slate-600 text-center">
        <a href="/auth/login" class="hover:text-blue-600">
          {t("auth.verify_email.goto_signin", locale)}
        </a>
      </div>
    </div>
  </Layout>
);
