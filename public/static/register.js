// Client-side handler for /auth/register.
// Sends captcha token in `x-captcha-response` header (NOT body).
// On success: shows an email-verification notice in place of the form.

(function () {
  "use strict";

  var form = document.getElementById("register-form");
  if (!form) return;
  var errorEl = document.getElementById("error");
  var successEl = document.getElementById("success");
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

  function showSuccess(email) {
    if (!successEl) return;
    successEl.textContent = "验证邮件已发送到 " + email + "，请查收（15 分钟内有效）";
    successEl.classList.remove("hidden");
    form.classList.add("hidden");
  }

  function mapError(status, message) {
    var m = (message || "").toLowerCase();
    if (m.indexOf("captcha") !== -1 || m.indexOf("turnstile") !== -1) {
      return "请完成人机验证";
    }
    if (
      status === 422 ||
      m.indexOf("exist") !== -1 ||
      m.indexOf("already") !== -1 ||
      m.indexOf("taken") !== -1 ||
      m.indexOf("duplicate") !== -1
    ) {
      return "该邮箱已注册";
    }
    if (
      m.indexOf("password") !== -1 &&
      (m.indexOf("short") !== -1 || m.indexOf("weak") !== -1 || m.indexOf("min") !== -1 || m.indexOf("length") !== -1 || m.indexOf("12") !== -1)
    ) {
      return "密码需至少 12 位";
    }
    if (status === 429 || m.indexOf("rate") !== -1 || m.indexOf("too many") !== -1) {
      return "请求过于频繁，请稍后再试";
    }
    return message || "注册失败，请重试";
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    clearError();

    var formData = new FormData(form);
    var email = String(formData.get("email") || "").trim();
    var username = String(formData.get("username") || "").trim();
    var password = String(formData.get("password") || "");
    var name = String(formData.get("name") || "").trim();
    var captchaToken = String(formData.get("cf-turnstile-response") || "");

    if (!email || !password) {
      showError("请填写邮箱和密码");
      return;
    }
    if (password.length < 12) {
      showError("密码需至少 12 位");
      return;
    }
    if (!captchaToken) {
      showError("请完成人机验证");
      return;
    }

    var payload = {
      email: email,
      password: password,
      name: name || email.split("@")[0],
    };
    if (username) {
      payload.username = username;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "注册中...";
    }

    try {
      var res = await fetch("/api/auth/sign-up/email", {
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

      showSuccess(email);
    } catch (err) {
      showError("网络错误，请检查连接");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "注册";
      }
    }
  });
})();
