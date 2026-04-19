import type { FC, PropsWithChildren } from "hono/jsx";

type Props = PropsWithChildren<{
  title: string;
  scriptSrc?: string;
}>;

export const Layout: FC<Props> = ({ title, scriptSrc, children }) => (
  <html lang="zh-CN">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${title} · 桥知 BridgingChina`}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <h1 class="text-2xl font-bold text-slate-900 mb-6 text-center">
          桥知 BridgingChina
        </h1>
        {children}
      </div>
      {scriptSrc ? <script src={scriptSrc} defer></script> : null}
    </body>
  </html>
);
