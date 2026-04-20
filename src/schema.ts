import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// NOTE: `onDelete: "cascade"` on FKs is declarative only on D1 — SQLite's per-connection
// `PRAGMA foreign_keys = OFF` default means CASCADE does not fire at DB level.
// Better Auth's internalAdapter.deleteUser() performs app-level cleanup of session+account
// rows before deleting the user, so this is not a correctness bug for the standard delete
// path. Verify this holds for any custom delete code added in Phase 2+.

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  name: text("name"),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  username: text("username").unique(),
  displayUsername: text("displayUsername"),
  role: text("role").notNull().default("user"),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  passwordChangedAt: integer("passwordChangedAt", { mode: "timestamp_ms" }),
  // BCP-47 locale tag. Read by JWT definePayload() so FastAPI and web/ can localize
  // without a round-trip to /api/auth/me. NOT NULL + default keeps existing rows valid
  // after ALTER TABLE (SQLite requires constant defaults for added NOT NULL columns).
  preferredLocale: text("preferred_locale").notNull().default("zh-CN"),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => ({
    userIdIdx: index("session_userId_idx").on(t.userId),
  }),
);

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  providerId: text("providerId").notNull(),
  accountId: text("accountId").notNull(),
  password: text("password"),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp_ms" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp_ms" }),
  scope: text("scope"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (t) => ({
    identifierIdx: index("verification_identifier_idx").on(t.identifier),
  }),
);

export const jwks = sqliteTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("publicKey").notNull(),
  privateKey: text("privateKey").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp_ms" }),
});
