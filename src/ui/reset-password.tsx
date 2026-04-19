import type { FC } from "hono/jsx";
import { Layout } from "./layout";

export const ResetPasswordPage: FC = () => {
  return (
    <Layout title="重置密码" scriptSrc="/static/reset-password.js">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-xl font-semibold text-slate-900 mb-2">重置密码</h2>
        <p class="text-sm text-slate-600 mb-6">请输入新密码，长度至少 12 位。</p>

        {/* Invalid-token state — shown by reset-password.js when ?token is missing. */}
        <div id="invalid-token" class="hidden">
          <div class="rounded bg-red-50 border border-red-200 p-4 text-sm text-red-800">
            链接无效或已过期，请重新申请重置密码。
          </div>
          <div class="pt-4 text-sm text-slate-600">
            <a href="/auth/forgot-password" class="hover:text-blue-600">
              忘记密码
            </a>
          </div>
        </div>

        {/* Form state — visible by default, hidden by reset-password.js if no token. */}
        <form id="reset-form" class="space-y-4" novalidate>
          <div>
            <label for="newPassword" class="block text-sm font-medium mb-1">
              新密码
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minlength={12}
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              placeholder="新密码（至少 12 位）"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-1">
              确认密码
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minlength={12}
              autocomplete="new-password"
              class="w-full border rounded px-3 py-2"
              placeholder="再次输入新密码"
            />
          </div>

          <div id="error" class="text-sm text-red-600 hidden"></div>

          <button
            id="submit"
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            重置密码
          </button>

          <div class="flex justify-between text-sm text-slate-600 pt-2">
            <a href="/auth/login" class="hover:text-blue-600">
              返回登录
            </a>
            <a href="/auth/forgot-password" class="hover:text-blue-600">
              重新申请
            </a>
          </div>
        </form>

        {/* Success state — shown by reset-password.js on HTTP 200. */}
        <div id="success" class="hidden">
          <div class="rounded bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            密码已重置成功。3 秒后自动跳转到登录页…
          </div>
        </div>
      </div>
    </Layout>
  );
};
