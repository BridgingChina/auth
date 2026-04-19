`auth.bridgingchina.net` — 桥知 BridgingChina unified authentication worker. Hono + Better Auth + Drizzle + Cloudflare D1. Plan: `../docs/plans/2026-04-19-unified-auth-implementation.md`.

## Dev env vars

Copy `.env.example` → `.env` and fill in credentials for `drizzle-kit generate/push`
(runtime D1 access uses wrangler bindings, not these vars).
