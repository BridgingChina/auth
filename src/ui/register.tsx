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
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-6">
        {t("auth.signup.heading", locale)}
      </h2>
      <form
        id="register-form"
        class="space-y-4"
        data-web-origin={webOrigin}
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium mb-1">
            {t("auth.signup.email_label", locale)}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.signup.email_placeholder", locale)}
          />
        </div>

        <div>
          <label for="username" class="block text-sm font-medium mb-1">
            {t("auth.signup.username_label", locale)}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autocomplete="username"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.signup.username_placeholder", locale)}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-1">
            {t("auth.signup.password_label", locale)}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minlength={12}
            autocomplete="new-password"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.signup.password_placeholder", locale)}
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium mb-1">
            {t("auth.signup.name_label", locale)}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autocomplete="nickname"
            class="w-full border rounded px-3 py-2"
            placeholder={t("auth.signup.name_placeholder", locale)}
          />
        </div>

        <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

        <div id="error" class="text-sm text-red-600 hidden"></div>

        <button
          id="submit"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t("auth.signup.submit", locale)}
        </button>

        <div class="text-sm text-slate-600 text-center pt-2">
          <a href="/auth/login" class="hover:text-blue-600">
            {t("auth.signup.back_to_signin", locale)}
          </a>
        </div>
      </form>

      <div
        id="success"
        class="hidden bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800"
      ></div>
    </div>
  </Layout>
);
