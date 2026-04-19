import type { FC } from "hono/jsx";
import { Layout } from "./layout";

type Props = {
  webOrigin: string;
};

export const VerifyEmailPage: FC<Props> = ({ webOrigin }) => (
  <Layout title="邮箱验证" scriptSrc="/static/verify-email.js">
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-slate-900 mb-6">邮箱验证</h2>

      {/* Hidden config element: client script reads webOrigin from here
          because Layout renders <body> and doesn't forward data-* props. */}
      <div id="config" data-web-origin={webOrigin} class="hidden"></div>

      <div id="loading" class="text-slate-600 text-center hidden">
        正在验证邮箱，请稍候...
      </div>

      <div
        id="success"
        class="text-green-700 bg-green-50 border border-green-200 rounded p-4"
      >
        <p id="success-message">邮箱验证成功，可以登录了。</p>
      </div>

      <div
        id="error"
        class="text-red-700 bg-red-50 border border-red-200 rounded p-4 hidden"
      >
        <p id="error-message">验证失败，链接可能已过期或已被使用。</p>
      </div>

      <div class="pt-6 text-sm text-slate-600 text-center">
        <a href="/auth/login" class="hover:text-blue-600">
          前往登录
        </a>
      </div>
    </div>
  </Layout>
);
