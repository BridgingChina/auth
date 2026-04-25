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
    <div class="auth-card">
      <h2 class="text-xl font-semibold text-[#1F1F1E] mb-2">
        {t("auth.magic_link.heading", locale)}
      </h2>
      <p class="text-sm text-[#6E6B65] mb-6">
        {t("auth.magic_link.description", locale)}
      </p>

      <form
        id="magic-link-form"
        class="space-y-4"
        data-web-origin={webOrigin}
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.magic_link.email_label", locale)}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            class="ds-input"
            placeholder="name@example.com"
          />
        </div>

        <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

        <div id="error" class="ds-field-error hidden"></div>

        <button
          id="submit"
          type="submit"
          class="ds-btn-primary"
        >
          {t("auth.magic_link.submit", locale)}
        </button>

        <div class="text-center pt-1">
          <a href="/auth/login" class="ds-link">
            {t("auth.magic_link.back_to_password", locale)}
          </a>
        </div>
      </form>

      <div id="success" class="hidden">
        <div class="ds-alert-success">
          <p id="success-message"></p>
        </div>
        <div class="pt-4 text-center">
          <a href="/auth/login" class="ds-link">
            {t("auth.magic_link.back_to_password", locale)}
          </a>
        </div>
      </div>
    </div>
  </Layout>
);
