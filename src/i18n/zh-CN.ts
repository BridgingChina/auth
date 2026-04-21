// zh-CN message dictionary. This file is the SOURCE OF TRUTH for MessageKey — all
// other locale dicts must implement the same keys (enforced via Record<MessageKey, string>
// typing in sibling files).
//
// Keys are flat dotted paths grouped by feature area:
//   auth.*    — auth UI flows (signin / signup / forgot / reset / magic / verify)
//   email.*   — transactional email subject / body / CTA
//   error.*   — user-facing error messages
//   action.*  — reusable button / action labels
//   layout.*  — layout chrome (brand, language switcher)
//
// Parameter interpolation: use `{{name}}` placeholders. Replacement happens in t() at runtime.

export const zhCN = {
  // --- layout / chrome ---
  "layout.brand": "桥知 BridgingChina",
  "layout.lang_zh": "中文",
  "layout.lang_en": "English",

  // --- auth.signin ---
  "auth.signin.title": "登录",
  "auth.signin.heading": "登录",
  "auth.signin.identifier_label": "邮箱或用户名",
  "auth.signin.identifier_placeholder": "name@example.com 或 用户名",
  "auth.signin.password_label": "密码",
  "auth.signin.password_placeholder": "至少 12 位",
  "auth.signin.submit": "登录",
  "auth.signin.magic_link_cta": "使用 Magic Link 登录",
  "auth.signin.forgot_password": "忘记密码",
  "auth.signin.register": "注册新账户",

  // --- auth.signup ---
  "auth.signup.title": "注册",
  "auth.signup.heading": "注册新账户",
  "auth.signup.email_label": "邮箱",
  "auth.signup.email_placeholder": "name@example.com",
  "auth.signup.username_label": "用户名",
  "auth.signup.username_placeholder": "可选，便于登录",
  "auth.signup.password_label": "密码",
  "auth.signup.password_placeholder": "至少 12 位",
  "auth.signup.name_label": "昵称",
  "auth.signup.name_placeholder": "显示名",
  "auth.signup.submit": "注册",
  "auth.signup.back_to_signin": "已有账户？返回登录",

  // --- auth.forgot_password ---
  "auth.forgot_password.title": "忘记密码",
  "auth.forgot_password.heading": "忘记密码",
  "auth.forgot_password.description":
    "输入注册邮箱，我们会发送密码重置链接到该邮箱。",
  "auth.forgot_password.email_label": "邮箱",
  "auth.forgot_password.submit": "发送重置邮件",
  "auth.forgot_password.back_to_signin": "返回登录",
  "auth.forgot_password.register": "注册新账户",

  // --- auth.reset_password ---
  "auth.reset_password.title": "重置密码",
  "auth.reset_password.heading": "重置密码",
  "auth.reset_password.description": "请输入新密码，长度至少 12 位。",
  "auth.reset_password.invalid_token":
    "链接无效或已过期，请重新申请重置密码。",
  "auth.reset_password.new_label": "新密码",
  "auth.reset_password.new_placeholder": "新密码（至少 12 位）",
  "auth.reset_password.confirm_label": "确认密码",
  "auth.reset_password.confirm_placeholder": "再次输入新密码",
  "auth.reset_password.submit": "重置密码",
  "auth.reset_password.back_to_signin": "返回登录",
  "auth.reset_password.re_request": "重新申请",
  "auth.reset_password.success":
    "密码已重置成功。3 秒后自动跳转到登录页…",

  // --- auth.magic_link ---
  "auth.magic_link.title": "Magic Link 登录",
  "auth.magic_link.heading": "Magic Link 登录",
  "auth.magic_link.description":
    "输入注册邮箱，我们会发送一次性登录链接到该邮箱，点击链接即可登录，无需密码。",
  "auth.magic_link.email_label": "邮箱",
  "auth.magic_link.submit": "发送登录链接",
  "auth.magic_link.back_to_password": "返回密码登录",

  // --- auth.verify_email ---
  "auth.verify_email.title": "邮箱验证",
  "auth.verify_email.heading": "邮箱验证",
  "auth.verify_email.loading": "正在验证邮箱，请稍候…",
  "auth.verify_email.success": "邮箱验证成功，可以登录了。",
  "auth.verify_email.error": "验证失败，链接可能已过期或已被使用。",
  "auth.verify_email.goto_signin": "前往登录",

  // --- email.verify ---
  "email.verify.subject": "验证你的桥知邮箱",
  "email.verify.heading": "欢迎加入桥知",
  "email.verify.body": "请点击下方链接验证你的邮箱（15 分钟内有效）：",
  "email.verify.cta": "验证邮箱",

  // --- email.reset ---
  "email.reset.subject": "重置你的桥知账户密码",
  "email.reset.heading": "重置密码",
  "email.reset.body": "请点击下方链接重置密码（15 分钟内有效）：",
  "email.reset.cta": "重置密码",

  // --- email.magic ---
  "email.magic.subject": "桥知 Magic Link 登录",
  "email.magic.heading": "登录链接",
  "email.magic.body": "请点击下方链接登录（5 分钟内有效）：",
  "email.magic.cta": "立即登录",

  // --- errors ---
  "error.invalid_credentials": "邮箱或密码错误",
  "error.email_not_verified": "邮箱未验证",
  "error.turnstile_failed": "人机验证未通过",
  "error.user_exists": "该邮箱或用户名已注册",
  "error.rate_limited": "请求过于频繁，请稍后重试",

  // --- actions ---
  "action.sign_in": "登录",
  "action.sign_up": "注册",
  "action.sign_out": "退出登录",
  "action.save": "保存",
  "action.cancel": "取消",
} as const;
