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
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-6">{t("auth.signin.heading", locale)}</h2>
        <form
          id="login-form"
          class="space-y-4"
          data-redirect={resolvedRedirect}
          data-fallback={webOrigin}
          novalidate
        >
          <input type="hidden" name="redirect_to" value={redirectTo ?? ""} />

          <div>
            <label for="identifier" class="block text-sm font-medium mb-1">
              {t("auth.signin.identifier_label", locale)}
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              autocomplete="username"
              class="w-full border rounded px-3 py-2"
              placeholder={t("auth.signin.identifier_placeholder", locale)}
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1">
              {t("auth.signin.password_label", locale)}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full border rounded px-3 py-2"
              placeholder={t("auth.signin.password_placeholder", locale)}
            />
          </div>

          <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

          <div id="error" class="text-sm text-red-600 hidden"></div>

          <button
            id="submit"
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {t("auth.signin.submit", locale)}
          </button>

          <a
            href="/auth/magic-link"
            class="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            {t("auth.signin.magic_link_cta", locale)}
          </a>

          <div class="flex justify-between text-sm text-slate-600 pt-2">
            <a href="/auth/forgot-password" class="hover:text-blue-600">
              {t("auth.signin.forgot_password", locale)}
            </a>
            <a href="/auth/register" class="hover:text-blue-600">
              {t("auth.signin.register", locale)}
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};
