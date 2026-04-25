import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  locale: Locale;
};

export const ResetPasswordPage: FC<Props> = ({ locale }) => (
  <Layout
    title={t("auth.reset_password.title", locale)}
    scriptSrc="/static/reset-password.js"
    locale={locale}
  >
    <div class="auth-card">
      <h2 class="text-xl font-semibold text-[#1F1F1E] mb-2">
        {t("auth.reset_password.heading", locale)}
      </h2>
      <p class="text-sm text-[#6E6B65] mb-6">
        {t("auth.reset_password.description", locale)}
      </p>

      {/* Invalid-token state — shown by reset-password.js when ?token is missing. */}
      <div id="invalid-token" class="hidden">
        <div class="ds-alert-error">
          {t("auth.reset_password.invalid_token", locale)}
        </div>
        <div class="pt-4">
          <a href="/auth/forgot-password" class="ds-link">
            {t("auth.signin.forgot_password", locale)}
          </a>
        </div>
      </div>

      {/* Form state — visible by default, hidden by reset-password.js if no token. */}
      <form id="reset-form" class="space-y-4" novalidate>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.reset_password.new_label", locale)}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="ds-input"
            placeholder={t("auth.reset_password.new_placeholder", locale)}
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.reset_password.confirm_label", locale)}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="ds-input"
            placeholder={t("auth.reset_password.confirm_placeholder", locale)}
          />
        </div>

        <div id="error" class="ds-field-error hidden"></div>

        <button
          id="submit"
          type="submit"
          class="ds-btn-primary"
        >
          {t("auth.reset_password.submit", locale)}
        </button>

        <div class="flex justify-between pt-1">
          <a href="/auth/login" class="ds-link">
            {t("auth.reset_password.back_to_signin", locale)}
          </a>
          <a href="/auth/forgot-password" class="ds-link">
            {t("auth.reset_password.re_request", locale)}
          </a>
        </div>
      </form>

      {/* Success state — shown by reset-password.js on HTTP 200. */}
      <div id="success" class="hidden">
        <div class="ds-alert-success">
          {t("auth.reset_password.success", locale)}
        </div>
      </div>
    </div>
  </Layout>
);
