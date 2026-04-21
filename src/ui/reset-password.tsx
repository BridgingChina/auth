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
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-2">
        {t("auth.reset_password.heading", locale)}
      </h2>
      <p class="text-sm text-slate-600 mb-6">
        {t("auth.reset_password.description", locale)}
      </p>

      {/* Invalid-token state — shown by reset-password.js when ?token is missing. */}
      <div id="invalid-token" class="hidden">
        <div class="rounded bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {t("auth.reset_password.invalid_token", locale)}
        </div>
        <div class="pt-4 text-sm text-slate-600">
          <a href="/auth/forgot-password" class="hover:text-blue-600">
            {t("auth.signin.forgot_password", locale)}
          </a>
        </div>
      </div>

      {/* Form state — visible by default, hidden by reset-password.js if no token. */}
      <form id="reset-form" class="space-y-4" novalidate>
        <div>
          <label for="newPassword" class="block text-sm font-medium mb-1">
            {t("auth.reset_password.new_label", locale)}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.reset_password.new_placeholder", locale)}
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium mb-1">
            {t("auth.reset_password.confirm_label", locale)}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.reset_password.confirm_placeholder", locale)}
          />
        </div>

        <div id="error" class="text-sm text-red-600 hidden"></div>

        <button
          id="submit"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t("auth.reset_password.submit", locale)}
        </button>

        <div class="flex justify-between text-sm text-slate-600 pt-2">
          <a href="/auth/login" class="hover:text-blue-600">
            {t("auth.reset_password.back_to_signin", locale)}
          </a>
          <a href="/auth/forgot-password" class="hover:text-blue-600">
            {t("auth.reset_password.re_request", locale)}
          </a>
        </div>
      </form>

      {/* Success state — shown by reset-password.js on HTTP 200. */}
      <div id="success" class="hidden">
        <div class="rounded bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          {t("auth.reset_password.success", locale)}
        </div>
      </div>
    </div>
  </Layout>
);
