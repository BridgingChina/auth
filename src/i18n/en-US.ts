// en-US message dictionary. Mirror of zh-CN.ts — the `Record<MessageKey, string>` type
// below forces parity: removing a key here is a type error, adding a new key that's not
// in zh-CN is also a type error (MessageKey is derived from zhCN in ./index.ts).

import type { MessageKey } from "./index";

export const enUS: Record<MessageKey, string> = {
  // --- auth.signin ---
  "auth.signin.title": "Sign in",
  "auth.signin.email": "Email",
  "auth.signin.password": "Password",
  "auth.signin.submit": "Sign in",

  // --- auth.signup ---
  "auth.signup.title": "Sign up",

  // --- auth.forgot_password ---
  "auth.forgot_password.title": "Forgot password",
  "auth.forgot_password.submit": "Send reset link",

  // --- auth.reset_password ---
  "auth.reset_password.title": "Reset password",

  // --- auth.magic_link ---
  "auth.magic_link.title": "Magic link sign-in",
  "auth.magic_link.subject": "Your sign-in link",

  // --- auth.verify_email ---
  "auth.verify_email.title": "Verify email",
  "auth.verify_email.body": "Please click the link below to verify your email.",
  "auth.verify_email.subject": "Verify your email",

  // --- errors ---
  "error.invalid_credentials": "Invalid email or password",
  "error.email_not_verified": "Email not verified",
  "error.turnstile_failed": "Captcha verification failed",

  // --- actions ---
  "action.sign_in": "Sign in",
  "action.sign_up": "Sign up",
  "action.sign_out": "Sign out",
  "action.save": "Save",
  "action.cancel": "Cancel",
};
