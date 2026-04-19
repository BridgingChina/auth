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
