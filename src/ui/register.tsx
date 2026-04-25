import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  siteKey: string;
  webOrigin: string;
  locale: Locale;
};

export const RegisterPage: FC<Props> = ({ siteKey, webOrigin, locale }) => (
  <Layout title={t("auth.signup.title", locale)} scriptSrc="/static/register.js" locale={locale}>
    <div class="auth-card">
      <h2 class="text-xl font-semibold text-[#1F1F1E] mb-6">
        {t("auth.signup.heading", locale)}
      </h2>
      <form
        id="register-form"
        class="space-y-4"
        data-web-origin={webOrigin}
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.signup.email_label", locale)}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            class="ds-input"
            placeholder={t("auth.signup.email_placeholder", locale)}
          />
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.signup.username_label", locale)}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autocomplete="username"
            class="ds-input"
            placeholder={t("auth.signup.username_placeholder", locale)}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.signup.password_label", locale)}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="ds-input"
            placeholder={t("auth.signup.password_placeholder", locale)}
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-[#1F1F1E] mb-1">
            {t("auth.signup.name_label", locale)}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autocomplete="nickname"
            class="ds-input"
            placeholder={t("auth.signup.name_placeholder", locale)}
          />
        </div>

        <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

        <div id="error" class="ds-field-error hidden"></div>

        <button
          id="submit"
          type="submit"
          class="ds-btn-primary"
        >
          {t("auth.signup.submit", locale)}
        </button>

        <div class="text-center pt-1">
          <a href="/auth/login" class="ds-link">
            {t("auth.signup.back_to_signin", locale)}
          </a>
        </div>
      </form>

      <div
        id="success"
        class="hidden ds-alert-success"
      ></div>
    </div>
  </Layout>
);
