import type { FC } from "hono/jsx";
import { Layout } from "./layout";
import { t, type Locale } from "../i18n";

type Props = {
  siteKey: string;
  webOrigin: string;
  redirectTo?: string;
  locale: Locale;
};

export const LoginPage: FC<Props> = ({ siteKey, webOrigin, redirectTo, locale }) => {
  const resolvedRedirect = redirectTo && redirectTo.length > 0 ? redirectTo : webOrigin;

  return (
    <Layout title={t("auth.signin.title", locale)} scriptSrc="/static/login.js" locale={locale}>
      <div class="auth-card">
        <h2 class="text-xl font-semibold text-[#1F1F1E] mb-6">{t("auth.signin.heading", locale)}</h2>
        <form
          id="login-form"
          class="space-y-4"
          data-redirect={resolvedRedirect}
          data-fallback={webOrigin}
          novalidate
        >
          <input type="hidden" name="redirect_to" value={redirectTo ?? ""} />

          <div>
            <label for="identifier" class="block text-sm font-medium text-[#1F1F1E] mb-1">
              {t("auth.signin.identifier_label", locale)}
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              autocomplete="username"
              class="ds-input"
              placeholder={t("auth.signin.identifier_placeholder", locale)}
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[#1F1F1E] mb-1">
              {t("auth.signin.password_label", locale)}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autocomplete="current-password"
              class="ds-input"
              placeholder={t("auth.signin.password_placeholder", locale)}
            />
          </div>

          <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

          <div id="error" class="ds-field-error hidden"></div>

          <button
            id="submit"
            type="submit"
            class="ds-btn-primary"
          >
            {t("auth.signin.submit", locale)}
          </button>

          <hr class="ds-divider" />

          <a
            href="/auth/magic-link"
            class="ds-btn-secondary"
          >
            {t("auth.signin.magic_link_cta", locale)}
          </a>

          <div class="flex justify-between pt-1">
            <a href="/auth/forgot-password" class="ds-link">
              {t("auth.signin.forgot_password", locale)}
            </a>
            <a href="/auth/register" class="ds-link">
              {t("auth.signin.register", locale)}
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};
