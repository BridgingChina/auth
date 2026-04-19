import type { FC } from "hono/jsx";
import { Layout } from "./layout";

type Props = {
  siteKey: string;
  webOrigin: string;
};

export const RegisterPage: FC<Props> = ({ siteKey, webOrigin }) => (
  <Layout title="注册" scriptSrc="/static/register.js">
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-6">注册新账户</h2>
      <form
        id="register-form"
        class="space-y-4"
        data-web-origin={webOrigin}
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium mb-1">
            邮箱
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

        <div>
          <label for="username" class="block text-sm font-medium mb-1">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autocomplete="username"
            class="w-full border rounded px-3 py-2"
            placeholder="可选，便于登录"
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
            minlength={12}
            autocomplete="new-password"
            class="w-full border rounded px-3 py-2"
            placeholder="至少 12 位"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium mb-1">
            昵称
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autocomplete="nickname"
            class="w-full border rounded px-3 py-2"
            placeholder="显示名"
          />
        </div>

        <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

        <div id="error" class="text-sm text-red-600 hidden"></div>

        <button
          id="submit"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          注册
        </button>

        <div class="text-sm text-slate-600 text-center pt-2">
          <a href="/auth/login" class="hover:text-blue-600">
            已有账户？返回登录
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
