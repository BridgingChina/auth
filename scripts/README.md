# auth/scripts

## export_admins_sql.ts

One-off migration: copy admins from RAG Postgres `users` table to auth D1 `user` table.

### Design

- **Password NOT migrated** — admins reset via `/auth/forgot-password` after migration. `hashed_password` is never read by this script.
- **Email placeholder** `{username}@migrate.bridgingchina.net` — admins update when they reset.
- **`role='admin'`** for all migrated users (old `users` table had no role column; everyone was admin).
- **`emailVerified=0`** — forces re-verification on first password reset.
- **`passwordChangedAt`** preserved from source if present (otherwise NULL).
- **Idempotent** via `INSERT OR IGNORE` (SQLite/D1 syntax).
- **No shell execution**: the script only reads PG + writes a SQL file. The human applies the SQL via `wrangler` manually.

### Run

1. Get Postgres connection string (from `RAG/.env` `DATABASE_URL`, adapt to the `postgresql://` form — strip the `+psycopg` driver hint).
2. Generate SQL:
   ```bash
   cd auth
   PG_URL="postgresql://user:pw@host:5433/rag" npx tsx scripts/export_admins_sql.ts
   ```
3. Review `scripts/migrate_admins.sql` (don't trust the script blindly).
4. Apply to D1:
   ```bash
   npx wrangler d1 execute bridgingchina-auth --remote --file=./scripts/migrate_admins.sql
   ```
5. Notify admins to reset their password at `https://auth.bridgingchina.net/auth/forgot-password`.

### Important

- `scripts/migrate_admins.sql` is generated output; **gitignored**.
- Re-running is safe (`INSERT OR IGNORE`).
- If you need to re-migrate an admin whose D1 record is broken, `DELETE FROM user WHERE username='xxx'` first, then re-run this script.
- The script connects to Postgres read-only (plain `SELECT`). It never mutates the source.

## create_admin.ts

Bootstrap a single new admin directly into the auth D1 `user` table. This is the replacement for the old `RAG/scripts/create_user.py` after Phase 2 of the unified-auth refactor removes it.

### Design

- **No password stored here.** The script creates only the `user` row (no `account` row). The new admin completes signup by visiting `/auth/forgot-password`, which triggers Better Auth's normal reset flow and materialises the `account` row with the `credential` provider. Keeps password hashing in exactly one place.
- **`emailVerified=1`** — the admin email is trusted at creation time (a human operator typed it). Differs from `export_admins_sql.ts`, which uses placeholder emails and forces re-verification.
- **`role='admin'`, `isActive=1`.**
- **`id`** is a 32-char base64url string from `crypto.randomBytes(24).toString("base64url")` — matches Better Auth's default nanoid-style id format.
- **No shell execution on input.** Same pattern as `export_admins_sql.ts`: the script writes a SQL file; the human applies it via `wrangler`. No Cloudflare API token needed.
- **CLI parsing** uses Node built-in `node:util` `parseArgs` — no extra deps.
- **Validation:** email matches a basic regex; optional username matches `^[A-Za-z0-9_]{3,30}$`.

### Run

```bash
cd auth
npx tsx scripts/create_admin.ts \
  --email admin@bridgingchina.net \
  --username admin \
  --name "Main Admin"
```

Flags:

- `--email` (required) — admin's real email (used for forgot-password).
- `--name` (required) — display name.
- `--username` (optional) — alternate-login username, 3-30 chars, `[A-Za-z0-9_]` only.

Then review and apply:

```bash
cat scripts/create_admin.sql
npx wrangler d1 execute bridgingchina-auth --remote --file=./scripts/create_admin.sql
```

Finally, tell the new admin to set their password at <https://auth.bridgingchina.net/auth/forgot-password> (they enter the email you just created).

### Important

- `scripts/create_admin.sql` is generated output; **gitignored**, overwritten on each run.
- The `INSERT` is **not** `INSERT OR IGNORE`: applying the SQL twice for the same email fails on the unique constraint (intentional — duplicate admin attempts should be loud, not silent).
- If you need to redo a record, `DELETE FROM user WHERE email='...'` first, then re-run.

