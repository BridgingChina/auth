# auth

`auth.bridgingchina.net` — 桥知 BridgingChina 统一身份服务。Hono + Better Auth 1.6 + Drizzle + Cloudflare D1 + Workers + Resend + Turnstile.

设计与实施计划见 `../docs/plans/2026-04-19-unified-auth-*.md`。

## Dev

```bash
npm install
cp .env.example .env          # 填 CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_DATABASE_ID / CLOUDFLARE_D1_TOKEN 给 drizzle-kit
npx wrangler dev --remote     # 本地跑，连远程 D1
npx tsc --noEmit              # typecheck
```

runtime D1 用 wrangler bindings，不读 `.env`。`.env` 只给 drizzle-kit 本地用。

## Deploy

生产部署由 **Cloudflare Workers Git Integration** 自动触发：

- `main` 分支 push → 自动跑 `npx wrangler deploy`，发布到 `auth.bridgingchina.net`
- 非生产分支：不部署（本地 `wrangler dev` 开发）
- Secrets 只在本地 `wrangler secret put <NAME>` 一次性写入 Worker，CI 不管 secrets

### Schema 变更纪律（⚠️ 必须遵守）

CI/CD **不跑 migration**。改 `src/schema.ts` 后：

```bash
# 本地：
npx drizzle-kit generate                                      # 生成 drizzle/NNNN_*.sql
git diff drizzle/                                             # review 生成的 SQL
npx wrangler d1 migrations apply bridgingchina-auth --remote  # 应用到 D1
git add src/schema.ts drizzle/
git commit -m "feat: <schema change>"
git push                                                      # CI 现在才开始部署代码
```

**顺序关键**：**先 apply migration 再 push**。反过来的话 CI 部署新代码碰到老 schema 会 500。

手动部署（绕过 CI）：`npx wrangler deploy`。

## Secrets

```bash
npx wrangler secret put BETTER_AUTH_SECRET       # openssl rand -base64 32
npx wrangler secret put INTERNAL_WEBHOOK_SECRET  # openssl rand -base64 32, Phase 2 的 FastAPI 也要配
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Public env vars（非 secret）在 `wrangler.jsonc` `vars` 块：`TURNSTILE_SITE_KEY`, `BETTER_AUTH_URL`, `WEB_ORIGIN`, `CONSOLE_ORIGIN`。

## 老管理员迁移

见 `scripts/README.md`。一次性操作，将 RAG Postgres `users` 表搬进 D1 `user` 表。

## 关键 endpoint

- `GET /health` — liveness
- `ALL /api/auth/*` — Better Auth handler（sign-in/sign-up/verify/reset 等 14 个端点）
- `GET /api/auth/jwks` — FastAPI 验签用的公钥 (EdDSA Ed25519, 15min JWT)
- `GET /auth/{login,register,forgot-password,reset-password,magic-link,verify-email}` — 登录相关 6 个 UI 页
