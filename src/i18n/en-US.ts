// en-US message dictionary. Mirror of zh-CN.ts — the `Record<MessageKey, string>` type
// below forces parity: removing a key here is a type error, adding a new key that's not
// in zh-CN is also a type error (MessageKey is derived from zhCN in ./index.ts).

import type { MessageKey } from "./index";

export const enUS: Record<MessageKey, string> = {
  // --- layout / chrome ---
  "layout.brand": "BridgingChina",
  "layout.lang_zh": "中文",
  "layout.lang_en": "English",

  // --- auth.signin ---
  "auth.signin.title": "Sign in",
  "auth.signin.heading": "Sign in",
  "auth.signin.identifier_label": "Email or username",
  "auth.signin.identifier_placeholder": "name@example.com or username",
  "auth.signin.password_label": "Password",
  "auth.signin.password_placeholder": "At least 12 characters",
  "auth.signin.submit": "Sign in",
  "auth.signin.magic_link_cta": "Sign in with Magic Link",
  "auth.signin.forgot_password": "Forgot password",
  "auth.signin.register": "Create a new account",

  // --- auth.signup ---
  "auth.signup.title": "Sign up",
  "auth.signup.heading": "Create a new account",
  "auth.signup.email_label": "Email",
  "auth.signup.email_placeholder": "name@example.com",
  "auth.signup.username_label": "Username",
  "auth.signup.username_placeholder": "Optional — makes signing in easier",
  "auth.signup.password_label": "Password",
  "auth.signup.password_placeholder": "At least 12 characters",
  "auth.signup.name_label": "Display name",
  "auth.signup.name_placeholder": "How should we call you",
  "auth.signup.submit": "Sign up",
  "auth.signup.back_to_signin": "Already have an account? Sign in",

  // --- auth.forgot_password ---
  "auth.forgot_password.title": "Forgot password",
  "auth.forgot_password.heading": "Forgot password",
  "auth.forgot_password.description":
    "Enter your registered email — we'll send a reset link to it.",
  "auth.forgot_password.email_label": "Email",
  "auth.forgot_password.submit": "Send reset email",
  "auth.forgot_password.back_to_signin": "Back to sign in",
  "auth.forgot_password.register": "Create a new account",

  // --- auth.reset_password ---
  "auth.reset_password.title": "Reset password",
  "auth.reset_password.heading": "Reset password",
  "auth.reset_password.description": "Enter a new password (at least 12 characters).",
  "auth.reset_password.invalid_token":
    "This link is invalid or has expired. Please request a new reset email.",
  "auth.reset_password.new_label": "New password",
  "auth.reset_password.new_placeholder": "New password (at least 12 characters)",
  "auth.reset_password.confirm_label": "Confirm password",
  "auth.reset_password.confirm_placeholder": "Re-enter the new password",
  "auth.reset_password.submit": "Reset password",
  "auth.reset_password.back_to_signin": "Back to sign in",
  "auth.reset_password.re_request": "Request again",
  "auth.reset_password.success":
    "Password reset successful. Redirecting to sign in in 3 seconds…",

  // --- auth.magic_link ---
  "auth.magic_link.title": "Magic Link sign in",
  "auth.magic_link.heading": "Magic Link sign in",
  "auth.magic_link.description":
    "Enter your registered email — we'll send you a one-time sign-in link. No password needed.",
  "auth.magic_link.email_label": "Email",
  "auth.magic_link.submit": "Send sign-in link",
  "auth.magic_link.back_to_password": "Back to password sign in",

  // --- auth.verify_email ---
  "auth.verify_email.title": "Verify email",
  "auth.verify_email.heading": "Verify email",
  "auth.verify_email.loading": "Verifying email, please wait…",
  "auth.verify_email.success": "Email verified — you can sign in now.",
  "auth.verify_email.error": "Verification failed. The link may be expired or already used.",
  "auth.verify_email.goto_signin": "Go to sign in",

  // --- email.verify ---
  "email.verify.subject": "Verify your BridgingChina email",
  "email.verify.heading": "Welcome to BridgingChina",
  "email.verify.body": "Click the link below to verify your email (valid for 15 minutes):",
  "email.verify.cta": "Verify email",

  // --- email.reset ---
  "email.reset.subject": "Reset your BridgingChina password",
  "email.reset.heading": "Reset your password",
  "email.reset.body": "Click the link below to reset your password (valid for 15 minutes):",
  "email.reset.cta": "Reset password",

  // --- email.magic ---
  "email.magic.subject": "Your BridgingChina Magic Link",
  "email.magic.heading": "Sign-in link",
  "email.magic.body": "Click the link below to sign in (valid for 5 minutes):",
  "email.magic.cta": "Sign in now",

  // --- errors ---
  "error.invalid_credentials": "Incorrect email or password",
  "error.email_not_verified": "Email not verified",
  "error.turnstile_failed": "Human verification failed",
  "error.user_exists": "This email or username is already registered",
  "error.rate_limited": "Too many requests — please try again later",

  // --- actions ---
  "action.sign_in": "Sign in",
  "action.sign_up": "Sign up",
  "action.sign_out": "Sign out",
  "action.save": "Save",
  "action.cancel": "Cancel",
};
