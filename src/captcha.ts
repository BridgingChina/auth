export async function verifyTurnstile(token: string, secret: string, ip?: string) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const json = (await res.json()) as { success: boolean };
  return json.success;
}
