import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Standalone Vercel function backing the static site's contact form.
// The GitHub Pages site (cross-origin) POSTs { name, email, message, token }.
// This function verifies the reCAPTCHA v3 token, then emails the inquiry to the
// site owner via Resend (admin-notify only; reply-to is set to the visitor).
//
// Required env (set in the Vercel project, never in the static build):
//   RESEND_API_KEY            Resend API key
//   RESEND_FROM_EMAIL         Verified-domain sender, or the resend.dev sandbox
//   ADMIN_NOTIFICATION_EMAIL  Where inquiries are delivered (your inbox)
//   RECAPTCHA_SECRET_KEY      reCAPTCHA v3 secret (pairs with the site key)
//   ALLOWED_ORIGIN            Comma-separated browser origins allowed to POST
// Optional:
//   RECAPTCHA_MIN_SCORE       Minimum score to accept (0.0-1.0), default 0.5

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const EXPECTED_ACTION = "contact_form";

type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

function escapeHtml(value: string): string {
  return value.replace(
    /[<>&]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] ?? c,
  );
}

function applyCors(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Browsers enforce CORS, but a non-browser client ignores it. Reject any
  // disallowed Origin server-side as a second gate.
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.length > 0 && (!origin || !ALLOWED_ORIGINS.includes(origin))) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";

  if (!name || !email || message.length < 10 || !token) {
    res.status(400).json({ error: "Invalid form submission" });
    return;
  }

  if (!RECAPTCHA_SECRET) {
    res.status(500).json({ error: "Server is missing RECAPTCHA_SECRET_KEY" });
    return;
  }

  // 1. Verify the reCAPTCHA v3 token with Google.
  let verify: RecaptchaVerifyResponse;
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET,
          response: token,
        }),
      },
    );
    verify = (await response.json()) as RecaptchaVerifyResponse;
  } catch {
    res.status(502).json({ error: "Could not reach reCAPTCHA" });
    return;
  }

  const scoreOk = typeof verify.score !== "number" || verify.score >= MIN_SCORE;
  const actionOk = !verify.action || verify.action === EXPECTED_ACTION;
  if (!verify.success || !scoreOk || !actionOk) {
    res.status(400).json({ error: "reCAPTCHA verification failed" });
    return;
  }

  // 2. Send the inquiry to the site owner via Resend.
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    res.status(500).json({ error: "Server email is not configured" });
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const scoreLabel =
    typeof verify.score === "number" ? verify.score.toFixed(2) : "n/a";

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nreCAPTCHA score: ${scoreLabel}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>reCAPTCHA score:</strong> ${scoreLabel}</p>
<hr/>
<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
  });

  // The Resend Node SDK returns { data, error } and does not throw.
  if (error) {
    res.status(502).json({ error: "Email delivery failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
