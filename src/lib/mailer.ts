import nodemailer from "nodemailer";
import { profile } from "@/data/profile";

export type VisitorLead = {
  name: string;
  email: string;
  page?: string;
  referrer?: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;

// Lazy + cached so a missing SMTP config doesn't blow up the route module at
// import time — `sendVisitorNotification` just throws when it's actually
// called, which the route handler already expects to catch.
function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
}

function escapeHtml(value: string) {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (c) => map[c]);
}

// Inline-styled and table-based on purpose — most inboxes strip <style>
// blocks and ignore modern CSS, so the site's ink/gold theme is reproduced
// by hand here rather than reused from globals.css.
function visitorEmailHtml(lead: VisitorLead) {
  const name = escapeHtml(lead.name);
  const email = escapeHtml(lead.email);
  const page = escapeHtml(lead.page || "/");
  const referrer = escapeHtml(lead.referrer || "direct / unknown");
  const firstName = escapeHtml(lead.name.split(" ")[0] || lead.name);
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const row = (label: string, value: string, isLast = false) => `
    <tr>
      <td style="padding:14px 0;${isLast ? "" : "border-bottom:1px solid #ffffff1f;"}font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8f8f95;width:96px;vertical-align:top;">${label}</td>
      <td style="padding:14px 0;${isLast ? "" : "border-bottom:1px solid #ffffff1f;"}font-size:14px;color:#f2f1ee;font-family:'IBM Plex Mono',Consolas,monospace;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#09090a;font-family:'IBM Plex Sans',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#131315;border:1px solid #ffffff1f;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 28px;border-bottom:1px solid #ffffff1f;">
                <span style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#e3a857;">The Weekend Builder</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;line-height:1.35;color:#f2f1ee;">
                  Someone landed on your portfolio.
                </p>
                <p style="margin:0 0 22px;font-size:12px;color:#8f8f95;">${when} IST</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ffffff1f;">
                  ${row("Name", name)}
                  ${row("Email", `<a href="mailto:${email}" style="color:#f4c572;text-decoration:none;">${email}</a>`)}
                  ${row("Landed on", page)}
                  ${row("Came from", referrer, true)}
                </table>

                <a href="mailto:${email}" style="display:inline-block;margin-top:24px;padding:12px 22px;background:#e3a857;color:#09090a;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:999px;font-weight:600;">
                  Reply to ${firstName}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid #ffffff1f;">
                <p style="margin:0;font-size:11px;color:#8f8f95;">Sent automatically from the visitor note on ${escapeHtml(profile.site)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendVisitorNotification(lead: VisitorLead) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const to = process.env.NOTIFY_TO_EMAIL || profile.email;

  await transporter.sendMail({
    to,
    from: `"The Weekend Builder" <${from}>`,
    replyTo: `"${lead.name}" <${lead.email}>`,
    subject: `New visitor: ${lead.name} just landed on your portfolio`,
    html: visitorEmailHtml(lead),
    text: `${lead.name} <${lead.email}> landed on ${lead.page || "/"}\nReferrer: ${lead.referrer || "direct/unknown"}`,
  });
}
