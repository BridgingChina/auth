# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in the `auth/` sub-repo.

## 角色

`auth.bridgingchina.net` — 桥知 BridgingChina 的**统一身份服务**。整个项目身份唯一出口，签发 EdDSA JWT 给 FastAPI 验签，通过 `Domain=.bridgingchina.net` 跨子域 cookie 让 C 端 (`web/`) 和管理后台 (`RAG/web/`) 共享 session。

## 技术栈

```
Hono 4 + Better Auth 1.6 + Drizzle ORM + Cloudflare D1 + Cloudflare Workers
+ Resend (邮件) + Cloudflare Turnstile (人机验证)
```

- Runtime：Cloudflare Workers（V8 isolates，无 Node）
- 数据库：**独立 D1** (`bridgingchina-auth`, WNAM region) —— 与 RAG Postgres **不共库**。跨库通过 JWT + webhook 协调。
- JSX：Hono JSX (SSR only)，入口 `src/index.tsx`，不是 `.ts`
- JWT：Better Auth `jwt` plugin，**EdDSA Ed25519**（不是 RS256！），15 分钟过期，JWKS 在 `/api/auth/jwks`

## 目录结构

```
auth/
├── src/
│   ├── index.tsx       # Hono app + CORS + handler mount + UI 路由
│   ├── auth.ts         # Better Auth config（plugins / adapters / callbacks）
│   ├── schema.ts       # Drizzle D1 schema (5 表：user/session/account/verification/jwks)
│   ├── email.ts        # Resend sendEmail 函数
│   ├── captcha.ts      # Turnstile siteverify fallback（Better Auth 原生 plugin 默认够用）
│   └── ui/             # 6 个 Hono JSX 页面
│       ├── layout.tsx
│       ├── login.tsx / register.tsx
│       ├── forgot-password.tsx / reset-password.tsx
│       ├── magic-link.tsx / verify-email.tsx
├── public/static/      # 6 个客户端 JS（纯浏览器，不走 bundler）
├── drizzle/            # 由 drizzle-kit generate 产出，入库
├── scripts/
│   ├── export_admins_sql.ts    # 老 admin 从 PG 迁 D1
│   └── README.md
├── wrangler.jsonc      # D1 binding / routes / vars / assets
├── tsconfig.json       # JSX via hono/jsx, strict, skipLibCheck
└── .env.example        # 仅 drizzle-kit 本地用
```

**关键原则**：`src/` 是 Worker 代码，`public/` 是 Cloudflare Assets（静态托管），`scripts/` 是本地运行的 Node 脚本（tsx），三者隔离。

## Phase 映射（Phase 1 内部）

见 `../docs/plans/2026-04-19-unified-auth-implementation.md` Part B。当前 12 commits 的阶段：

| Task | 状态 |
|---|---|
| 1.1 Drizzle schema + D1 migration | ✅ |
| 1.2 Better Auth config（含 API 对齐修复）| ✅ |
| 1.3 挂载 handler | ✅ |
| 1.4-1.9 6 UI 页面 | ✅ |
| 1.11 admin 迁移脚本 | ✅（生成，未执行 —— 等 RAG Postgres 上线）|
| 1.10 E2E Playwright | ⏳ 未开始 |
| 1.12 生产 DoD 收官 | ⏳ 未开始 |

## 架构不变量（改动时必查）

1. **身份唯一出口**：所有"谁在操作"的判断来自 `auth/` 签的 JWT，FastAPI 不再自签。改 FastAPI 的 `/api/v1/auth/login` 时注意这个是老代码（Phase 2 会被删）。
2. **不要共用 D1 和 Postgres**：auth 用 D1，业务数据用 Postgres。跨库一致性走 webhook + cron，不走 FK。
3. **`/api/auth/*` 路径对齐 Better Auth 1.6 源码**：历史上有三次因上游文档 / 计划文档 / in-file 注释与源码不符导致的 bug：(a) `/forget-password` 应为 `/request-password-reset`；(b) `better-auth/plugins/captcha` 不是 subpath export，要走 aggregator `better-auth/plugins`；(c) `jwt({ jwt: { definePayload } })` **替换** payload，不是合并 —— 见 `node_modules/better-auth/dist/plugins/jwt/sign.mjs:53`：`payload = await options.jwt.definePayload(ctx.context.session)`，plugin 之后只补 `sub/iat/iss/aud/exp`，`email/name/emailVerified/isActive/...` 全部丢。FastAPI `CurrentUser.from_payload` 会因 `payload["email"]` KeyError 一律 401。definePayload 要 spread `ctx.user` 打底再覆盖新字段。**写配置前去 `node_modules/better-auth/dist/` grep 验证**。
4. **tsconfig `strict + skipLibCheck`**：`skipLibCheck` 不能关，否则 Better Auth 的 d.ts 和 Drizzle 的 d.ts 互相踩到会 CI 挂。
5. **Hono JSX 用 HTML 属性**（`class=`, `for=`, `charSet=`），不是 React 的 `className=` —— IDE 可能提示错，信代码不信 IDE。
6. **客户端脚本不用 TypeScript**：`public/static/*.js` 是纯浏览器 JS，没 bundler，没 imports。要共享逻辑就在 server 端插 data-attrs 传进去。
7. **Captcha token 走 `x-captcha-response` HEADER 不是 body**：Better Auth's captcha plugin 读 header。写新客户端脚本必须遵守。
8. **JWT payload 契约是跨仓共识**：FastAPI `app/models/current_user.py::from_payload` 当前硬依赖 `sub` + `email`；可选读 `role/emailVerified/username/name/isActive`。auth 仓改 `definePayload` 或 `user.additionalFields` 时必须同步 grep FastAPI 的 payload 读取点，否则生产 401 雪崩（每个请求都挂，不是偶发）。

## Commands（速查）

本地开发：
```bash
npm install
cp .env.example .env
npx wrangler dev --remote
```

Typecheck + deploy：
```bash
npx tsc --noEmit
npx wrangler deploy
```

Schema 改动：
```bash
# 1. 改 src/schema.ts
npx drizzle-kit generate                     # 产出 drizzle/NNNN_*.sql
git diff drizzle/                            # review
npx wrangler d1 migrations apply bridgingchina-auth --remote  # apply（必须先于 push！）
git add src/schema.ts drizzle/
git commit -m "..."
git push                                     # CI 现在才跑 wrangler deploy
```

看 D1 表 / 查数据：
```bash
npx wrangler d1 execute bridgingchina-auth --remote --command "SELECT * FROM user LIMIT 5"
npx wrangler d1 execute bridgingchina-auth --remote --command ".tables"
```

管理 secrets：
```bash
npx wrangler secret put <NAME>               # 写
npx wrangler secret list                     # 读列表（值看不到）
```

## CI/CD（Cloudflare Workers Git Integration）

- Git: `EchoBridgeCQU/auth` (private)
- Trigger: push to `main`
- Build: 自动 `npm install`
- Deploy: `npx wrangler deploy`
- 非生产分支: 不部署
- **CI 不跑 migration**，schema 变更必须**本地 apply 后再 push**

## 常见坑

1. **"我改了 schema 推了代码但 sign-up 500"** —— 你忘了跑 `wrangler d1 migrations apply`。CI 不替你跑。
2. **"local dev 登录了但 cookie 不持久"** —— 本地 http 下 `useSecureCookies` 自动关（gated on `BETTER_AUTH_URL` https 前缀）。如果还不行，检查 `.dev.vars` 的 `BETTER_AUTH_URL` 是不是 `http://localhost:8787`。
3. **"magic link 点开 404"** —— Better Auth 的 callbackURL 默认 `/`，但 auth 子域根路径会 302 到 `WEB_ORIGIN`；如果想 callback 到 C 端具体页面，前端发 magic link 时显式传 `callbackURL`。
4. **"deploy 报 `wildcard not allowed in custom domain`"** —— `wrangler.jsonc routes` 的 custom_domain 只能写 hostname（`auth.bridgingchina.net`），不能加 `/*`。
5. **"drizzle-kit generate 说连不上 D1"** —— 它需要 `CLOUDFLARE_D1_TOKEN` 的 API token（不是 wrangler OAuth），在 `.env` 里配。`generate` 本身是离线的，只有 `push` / `studio` 需要这个 token。

## 关联文档

- 设计总文档: `../docs/plans/2026-04-19-unified-auth-design.md`
- 实施计划: `../docs/plans/2026-04-19-unified-auth-implementation.md`（Phase 0/1 详细，Phase 2/3/4 Phase 1 上线稳定后再展开）
- 伞式仓库总览: `../CLAUDE.md`
- Better Auth 上游文档: <https://better-auth.com/docs>
