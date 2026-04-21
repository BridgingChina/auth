import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  siteKey: string;
  webOrigin: string;
  locale: Locale;
};

export const MagicLinkPage: FC<Props> = ({ siteKey, webOrigin, locale }) => (
  <Layout
    title={t("auth.magic_link.title", locale)}
    scriptSrc="/static/magic-link.js"
    locale={locale}
  >
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-2">
        {t("auth.magic_link.heading", locale)}
      </h2>
      <p class="text-sm text-slate-600 mb-6">
        {t("auth.magic_link.description", locale)}
      </p>

      <form
        id="magic-link-form"
        class="space-y-4"
        data-web-origin={webOrigin}
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium mb-1">
            {t("auth.magic_link.email_label", locale)}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            class="w-full border rounded px-3 py-2"
            placeholder="name@example.com"
          />
        </div>

        <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

        <div id="error" class="text-sm text-red-600 hidden"></div>

        <button
          id="submit"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t("auth.magic_link.submit", locale)}
        </button>

        <div class="text-sm text-slate-600 text-center pt-2">
          <a href="/auth/login" class="hover:text-blue-600">
            {t("auth.magic_link.back_to_password", locale)}
          </a>
        </div>
      </form>

      <div id="success" class="hidden">
        <div class="text-green-700 bg-green-50 border border-green-200 rounded p-4">
          <p id="success-message"></p>
        </div>
        <div class="pt-4 text-sm text-slate-600 text-center">
          <a href="/auth/login" class="hover:text-blue-600">
            {t("auth.magic_link.back_to_password", locale)}
          </a>
        </div>
      </div>
    </div>
  </Layout>
);
