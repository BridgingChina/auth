import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  siteKey: string;
  locale: Locale;
};

export const ForgotPasswordPage: FC<Props> = ({ siteKey, locale }) => (
  <Layout
    title={t("auth.forgot_password.title", locale)}
    scriptSrc="/static/forgot-password.js"
    locale={locale}
  >
    <div class="auth-card">
      <h2 class="text-xl font-semibold text-[#1F1F1E] mb-2">
        {t("auth.forgot_password.heading", locale)}
      </h2>
      <p class="text-sm text-[#6E6B65] mb-6">
        {t("auth.forgot_password.description", locale)}
      </p>

      <form id="forgot-form" class="space-y-4" novalidate>
        <div>
          <label for="email" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.forgot_password.email_label", locale)}
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
          {t("auth.forgot_password.submit", locale)}
        </button>

        <div class="flex justify-between pt-1">
          <a href="/auth/login" class="ds-link">
            {t("auth.forgot_password.back_to_signin", locale)}
          </a>
          <a href="/auth/register" class="ds-link">
            {t("auth.forgot_password.register", locale)}
          </a>
        </div>
      </form>

      <div id="success" class="hidden">
        <div class="ds-alert-success">
          <p id="success-message"></p>
        </div>
        <div class="pt-4">
          <a href="/auth/login" class="ds-link">
            {t("auth.forgot_password.back_to_signin", locale)}
          </a>
        </div>
      </div>
    </div>
  </Layout>
);
