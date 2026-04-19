// Client-side handler for /auth/reset-password.
// Reads reset token from URL querystring (?token=...).
// No captcha required — reset-password is not in Better Auth captcha.endpoints allowlist.
// Endpoint: POST /api/auth/reset-password with { token, newPassword }.

(function () {
  "use strict";

  var form = document.getElementById("reset-form");
  var invalidEl = document.getElementById("invalid-token");
  var successEl = document.getElementById("success");
  var errorEl = document.getElementById("error");
  var submitBtn = document.getElementById("submit");

  // Read token from URL querystring. Better Auth's reset link redirects here with ?token=...
  var params = new URLSearchParams(window.location.search);
  var token = params.get("token") || "";

  if (!token) {
    if (form) form.classList.add("hidden");
    if (invalidEl) invalidEl.classList.remove("hidden");
    return;
  }

  if (!form) return;

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
    if (m.indexOf("token") !== -1 || m.indexOf("expired") !== -1 || m.indexOf("invalid") !== -1) {
      return "链接已过期，请重新申请。前往忘记密码：/auth/forgot-password";
    }
    if (status === 429 || m.indexOf("rate") !== -1 || m.indexOf("too many") !== -1) {
      return "请求过于频繁，请稍后重试";
    }
    return message || "重置失败，请重试";
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    clearError();

    var formData = new FormData(form);
    var newPassword = String(formData.get("newPassword") || "");
    var confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword.length < 12) {
      showError("密码长度至少 12 位");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("两次输入的密码不一致");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "重置中...";
    }

    try {
      var res = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
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
        return;
      }

      // Success: hide form, show success message, redirect after 3s.
      form.classList.add("hidden");
      if (successEl) successEl.classList.remove("hidden");
      setTimeout(function () {
        window.location.href = "/auth/login";
      }, 3000);
    } catch (err) {
      showError("网络错误，请检查连接");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "重置密码";
      }
    }
  });
})();
