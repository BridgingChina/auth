import type { FC } from "hono/jsx";
import { Layout } from "./layout";

type Props = {
  siteKey: string;
};

export const ForgotPasswordPage: FC<Props> = ({ siteKey }) => {
  return (
    <Layout title="忘记密码" scriptSrc="/static/forgot-password.js">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-2">忘记密码</h2>
        <p class="text-sm text-slate-600 mb-6">
          输入注册邮箱，我们会发送密码重置链接到该邮箱。
        </p>

        <form id="forgot-form" class="space-y-4" novalidate>
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

          <div class="cf-turnstile" data-sitekey={siteKey} data-theme="light"></div>

          <div id="error" class="text-sm text-red-600 hidden"></div>

          <button
            id="submit"
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            发送重置邮件
          </button>

          <div class="flex justify-between text-sm text-slate-600 pt-2">
            <a href="/auth/login" class="hover:text-blue-600">
              返回登录
            </a>
            <a href="/auth/register" class="hover:text-blue-600">
              注册新账户
            </a>
          </div>
        </form>

        <div id="success" class="hidden">
          <div class="rounded bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <p id="success-message"></p>
          </div>
          <div class="pt-4 text-sm text-slate-600">
            <a href="/auth/login" class="hover:text-blue-600">
              返回登录
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
