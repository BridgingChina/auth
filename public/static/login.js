// Client-side handler for /auth/login.
// Sends captcha token in `x-captcha-response` header (NOT body).
// Auto-detects email vs username by presence of `@`.

(function () {
  "use strict";

  var form = document.getElementById("login-form");
  if (!form) return;
  var errorEl = document.getElementById("error");
  var submitBtn = document.getElementById("submit");

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  function mapError(status, message) {
    var m = (message || "").toLowerCase();
    if (m.indexOf("captcha") !== -1 || m.indexOf("turnstile") !== -1) {
      return "请完成人机验证";
    }
    if (status === 401 || status === 403 || m.indexOf("invalid") !== -1 || m.indexOf("incorrect") !== -1 || m.indexOf("password") !== -1) {
      return "邮箱/用户名或密码错误";
    }
    if (status === 429 || m.indexOf("rate") !== -1 || m.indexOf("too many") !== -1) {
      return "请求过于频繁，请稍后再试";
    }
    if (m.indexOf("not verified") !== -1 || m.indexOf("verify") !== -1) {
      return "邮箱尚未验证，请查收验证邮件";
    }
    return message || "登录失败，请重试";
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    clearError();

    var formData = new FormData(form);
    var identifier = String(formData.get("identifier") || "").trim();
    var password = String(formData.get("password") || "");
    var captchaToken = String(formData.get("cf-turnstile-response") || "");

    if (!identifier || !password) {
      showError("请输入账户和密码");
      return;
    }
    if (!captchaToken) {
      showError("请完成人机验证");
      return;
    }

    var isEmail = identifier.indexOf("@") !== -1;
    var endpoint = isEmail ? "/api/auth/sign-in/email" : "/api/auth/sign-in/username";
    var payload = isEmail
      ? { email: identifier, password: password }
      : { username: identifier, password: password };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "登录中...";
    }

    try {
      var res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-captcha-response": captchaToken,
        },
        body: JSON.stringify(payload),
      });

      var data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }

      if (!res.ok) {
        var msg = (data && (data.message || (data.error && data.error.message))) || "";
        showError(mapError(res.status, msg));
        if (typeof window.turnstile !== "undefined" && window.turnstile.reset) {
          try { window.turnstile.reset(); } catch (_) {}
        }
        return;
      }

      var redirectTo = form.dataset.redirect || form.dataset.fallback || "/";
      window.location.href = redirectTo;
    } catch (err) {
      showError("网络错误，请检查连接");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "登录";
      }
    }
  });
})();
