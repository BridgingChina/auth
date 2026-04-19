// Client-side handler for /auth/magic-link.
// POSTs to /api/auth/sign-in/magic-link with { email, callbackURL }.
// Includes x-captcha-response header defensively (magic-link is not currently
// in auth.ts captcha.endpoints list, but sending the header is harmless and
// future-proofs for when it gets added).

(function () {
  "use strict";

  var form = document.getElementById("magic-link-form");
  if (!form) return;
  var errorEl = document.getElementById("error");
  var submitBtn = document.getElementById("submit");
  var successEl = document.getElementById("success");
  var successMsgEl = document.getElementById("success-message");

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
    if (status === 429 || m.indexOf("rate") !== -1 || m.indexOf("too many") !== -1) {
      return "请求过于频繁，请稍后重试";
    }
    if (status === 400 || m.indexOf("invalid email") !== -1) {
      return "请输入有效的邮箱地址";
    }
    return message || "发送失败，请重试";
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    clearError();

    var formData = new FormData(form);
    var email = String(formData.get("email") || "").trim();
    var captchaToken = String(formData.get("cf-turnstile-response") || "");
    var webOrigin = form.dataset.webOrigin || "/";

    if (!email) {
      showError("请输入邮箱");
      return;
    }
    if (!captchaToken) {
      showError("请完成人机验证");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "发送中...";
    }

    try {
      var res = await fetch("/api/auth/sign-in/magic-link", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-captcha-response": captchaToken,
        },
        body: JSON.stringify({
          email: email,
          callbackURL: webOrigin,
        }),
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

      // Success: replace form with success message.
      if (successMsgEl) {
        successMsgEl.textContent =
          "登录链接已发送到 " + email + "，请在 5 分钟内点击链接完成登录。如果几分钟后仍未收到，请检查垃圾邮箱或重试。";
      }
      form.classList.add("hidden");
      if (successEl) successEl.classList.remove("hidden");
    } catch (err) {
      showError("网络错误，请检查连接");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "发送登录链接";
      }
    }
  });
})();
