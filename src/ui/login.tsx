import type { FC } from "hono/jsx";
import { Layout } from "./layout";

type Props = {
  siteKey: string;
  webOrigin: string;
  redirectTo?: string;
};

export const LoginPage: FC<Props> = ({ siteKey, webOrigin, redirectTo }) => {
  const resolvedRedirect = redirectTo && redirectTo.length > 0 ? redirectTo : webOrigin;

  return (
    <Layout title="登录" scriptSrc="/static/login.js">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-6">登录</h2>
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
              邮箱或用户名
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              autocomplete="username"
              class="w-full border rounded px-3 py-2"
              placeholder="name@example.com 或 用户名"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full border rounded px-3 py-2"
              placeholder="至少 12 位"
            />
          </div>

          <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

          <div id="error" class="text-sm text-red-600 hidden"></div>

          <button
            id="submit"
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            登录
          </button>

          <a
            href="/auth/magic-link"
            class="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            使用 Magic Link 登录
          </a>

          <div class="flex justify-between text-sm text-slate-600 pt-2">
            <a href="/auth/forgot-password" class="hover:text-blue-600">
              忘记密码
            </a>
            <a href="/auth/register" class="hover:text-blue-600">
              注册新账户
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};
