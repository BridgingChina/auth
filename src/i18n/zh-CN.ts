// zh-CN message dictionary. This file is the SOURCE OF TRUTH for MessageKey — all
// other locale dicts must implement the same keys (enforced via Record<MessageKey, string>
// typing in sibling files).
//
// Keys are flat dotted paths grouped by feature area:
//   auth.*    — auth flows (login / register / forgot-password / reset / magic-link / verify)
//   error.*   — user-facing error messages
//   action.*  — reusable button / action labels
//
// Parameter interpolation: use `{{name}}` placeholders. Replacement happens in t() at runtime.

export const zhCN = {
  // --- auth.signin ---
  "auth.signin.title": "登录",
  "auth.signin.email": "邮箱",
  "auth.signin.password": "密码",
  "auth.signin.submit": "登录",

  // --- auth.signup ---
  "auth.signup.title": "注册",

  // --- auth.forgot_password ---
  "auth.forgot_password.title": "忘记密码",
  "auth.forgot_password.submit": "发送重置链接",

  // --- auth.reset_password ---
  "auth.reset_password.title": "重置密码",

  // --- auth.magic_link ---
  "auth.magic_link.title": "魔法链接登录",
  "auth.magic_link.subject": "登录链接",

  // --- auth.verify_email ---
  "auth.verify_email.title": "验证邮箱",
  "auth.verify_email.body": "请点击下方链接验证邮箱",
  "auth.verify_email.subject": "验证你的邮箱",

  // --- errors ---
  "error.invalid_credentials": "邮箱或密码错误",
  "error.email_not_verified": "邮箱未验证",
  "error.turnstile_failed": "人机验证未通过",

  // --- actions ---
  "action.sign_in": "登录",
  "action.sign_up": "注册",
  "action.sign_out": "退出登录",
  "action.save": "保存",
  "action.cancel": "取消",
} as const;
