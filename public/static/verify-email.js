// Client-side handler for /auth/verify-email.
//
// Better Auth 1.6.5's /api/auth/verify-email is a GET endpoint (POST 405s).
// If the page loaded with ?token=..., delegate to Better Auth's built-in
// GET handler by navigating there with callbackURL embedded; it performs
// the verification + 302 redirect server-side.
// If no token in URL, assume verification already happened (user landed
// here from the built-in redirect) and keep the default success message.

(function () {
  "use strict";

  var configEl = document.getElementById("config");
  var webOrigin =
    (configEl && configEl.dataset && configEl.dataset.webOrigin) || "/";

  var params = new URLSearchParams(window.location.search);
  var token = params.get("token");

  if (!token) {
    // No token — default success copy already visible via server render.
    return;
  }

  var callback = encodeURIComponent(webOrigin);
  window.location.replace(
    "/api/auth/verify-email?token=" + encodeURIComponent(token) + "&callbackURL=" + callback
  );
})();
