// Transactional email helper.
//
// Delivery providers, in priority order:
//   1. Resend HTTP API (production) — set RESEND_API_KEY. EMAIL_FROM must use a
//      domain verified in Resend, e.g. "EligantWealth <no-reply@eligantwealth.com>".
//   2. SMTP — set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS (legacy fallback).
//   3. Dev console — when neither is configured, messages are logged so the
//      OTP flow stays testable offline.
//
// Resend setup:
//   - Verify your sending domain at resend.com → Domains (add the SPF/DKIM DNS records).
//   - RESEND_API_KEY=re_...                              (resend.com → API Keys)
//   - EMAIL_FROM="EligantWealth <no-reply@eligantwealth.com>"
import nodemailer, { type Transporter } from "nodemailer";

const FROM =
  process.env.EMAIL_FROM ??
  process.env.SMTP_USER ??
  "EligantWealth <no-reply@eligantwealth.com>";

let cachedTransport: Transporter | null = null;

function smtpTransport(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (cachedTransport) return cachedTransport;

  const port = Number(SMTP_PORT ?? 465);
  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransport;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<{ delivered: boolean }> {
  const plain =
    text ?? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // 1) Resend HTTP API (production path)
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html, text: plain }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend delivery failed (${res.status}): ${body}`);
    }
    return { delivered: true };
  }

  // 2) SMTP (legacy fallback)
  const transport = smtpTransport();
  if (transport) {
    await transport.sendMail({ from: FROM, to, subject, html, text: plain });
    return { delivered: true };
  }

  // 3) Dev fallback
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `\n📧 [dev email]\n   To:      ${to}\n   Subject: ${subject}\n   Body:    ${plain}\n`,
    );
  }
  return { delivered: false };
}

function codeEmail(heading: string, intro: string, code: string, footer: string) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;background:#0d1b2a;color:#eef3f0;border-radius:16px;padding:32px">
    <h2 style="margin:0 0 8px;color:#1ca65f">EligantWealth</h2>
    <p style="margin:0 0 6px;font-size:18px;font-weight:600">${heading}</p>
    <p style="margin:0 0 20px;color:#a8b8cc">${intro}</p>
    <div style="font-size:34px;font-weight:800;letter-spacing:8px;text-align:center;background:#192843;border:1px solid rgba(28,166,95,0.25);border-radius:12px;padding:18px 0;color:#fff">${code}</div>
    <p style="margin:20px 0 0;color:#6a7f96;font-size:13px">${footer}</p>
  </div>`;
}

/** One-time code emailed to confirm a new account's email address. */
export async function sendEmailVerificationEmail(to: string, code: string) {
  const subject = "Confirm your EligantWealth email";
  const text = `Your email confirmation code is ${code}. It expires in 10 minutes.`;
  const html = codeEmail(
    "Confirm your email",
    "Use this code to verify your email address and finish creating your account:",
    code,
    "This code expires in 10 minutes. If you didn't sign up, you can ignore this email.",
  );
  return sendEmail(to, subject, html, text);
}

/** One-time code emailed on every sign-in. */
export async function sendLoginOtpEmail(to: string, code: string) {
  const subject = "Your EligantWealth login code";
  const text =
    `Your one-time login code is ${code}. It expires in 5 minutes. ` +
    `If you didn't try to sign in, change your password immediately.`;
  const html = codeEmail(
    "Verify it's you",
    "Use this one-time code to finish signing in:",
    code,
    "This code expires in 5 minutes. If you didn't request it, change your password immediately.",
  );
  return sendEmail(to, subject, html, text);
}
