// Synchronous CORS preflight short-circuit.
//
// Registered as the FIRST middleware so that OPTIONS requests are answered
// from a single pure-function code path with zero D1 / auth / cookie / locale
// dependencies. Fixes issue #3 (intermittent 15s hangs on preflights) by:
//
//   1. Eliminating per-request middleware chain work on preflights (locale
//      middleware, hono/cors closure rebuild, Better Auth catch-all routing
//      are all skipped).
//   2. Emitting `Access-Control-Max-Age: 86400` so browsers cache the preflight
//      for up to the browser-enforced cap (Chrome 7200s, Firefox 86400s),
//      reducing preflight frequency by 1-2 orders of magnitude for steady
//      sessions and shrinking the blast radius of any residual edge-level
//      flakiness.
//
// Must run BEFORE the hono/cors middleware — otherwise cors handles OPTIONS
// first with its own (correct but heavier) logic that rebuilds the origin
// matcher closure per request and still walks the full middleware stack up
// to this point.
//
// Non-OPTIONS requests pass through untouched via next().

import type { MiddlewareHandler } from "hono";
import type { Env } from "../auth";

// Must stay in sync with the `allowMethods` + `allowHeaders` values passed to
// hono/cors in src/index.tsx. If you add a method or custom request header
// there, add it here too or the browser preflight will fail for the new shape.
const ALLOW_METHODS = "GET, POST, OPTIONS";
const DEFAULT_ALLOW_HEADERS = "Content-Type, Authorization, x-captcha-response";
const MAX_AGE_SECONDS = "86400";

export const preflightMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (
  c,
  next
) => {
  if (c.req.method !== "OPTIONS") return next();

  const origin = c.req.header("origin") ?? "";
  const allowList = [
    c.env.WEB_ORIGIN,
    c.env.CONSOLE_ORIGIN,
    c.env.BETTER_AUTH_URL,
  ];
  const allowOrigin = allowList.includes(origin) ? origin : null;

  const headers = new Headers();
  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin, Access-Control-Request-Headers");
    headers.set("Access-Control-Allow-Methods", ALLOW_METHODS);
    // Echo the client's requested headers when present (covers future additions
    // without code changes); fall back to the static whitelist otherwise.
    const requested = c.req.header("access-control-request-headers");
    headers.set(
      "Access-Control-Allow-Headers",
      requested && requested.length > 0 ? requested : DEFAULT_ALLOW_HEADERS
    );
    headers.set("Access-Control-Max-Age", MAX_AGE_SECONDS);
  }

  // Always 204 — even for disallowed origins the browser enforces the policy
  // by checking response headers, so no need to return 4xx (and doing so would
  // make cross-origin debugging noisier for misconfigured callers).
  return new Response(null, { status: 204, headers });
};
