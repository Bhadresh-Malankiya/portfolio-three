import { createHash } from "node:crypto";

export type ContactMessage = { name: string; email: string; message: string; intent: "project" | "hire" };
const MAX_BODY_BYTES = 24_000;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const HEADER_CONTROL = /[\u0000-\u001f\u007f]/;
const WINDOW_MS = 15 * 60 * 1000;
const recent = new Map<string, { count: number; expires: number }>();

// A bounded, per-instance burst guard. Honeypot and origin checks also run;
// a distributed edge rule can supplement this if sustained spam appears.
function allowMessage(request: Request, email: string) {
  const now = Date.now();
  for (const [key, value] of recent) if (value.expires <= now) recent.delete(key);
  const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const keys = [ip, email.toLowerCase()].map(value => createHash("sha256").update(value).digest("hex"));
  if (keys.some(key => (recent.get(key)?.count || 0) >= 5) || recent.size >= 2000) return false;
  for (const key of keys) {
    const entry = recent.get(key) || { count: 0, expires: now + WINDOW_MS };
    entry.count += 1;
    recent.set(key, entry);
  }
  return true;
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

export function createContactHandler(
  send: (message: ContactMessage) => Promise<void>,
  allow: (request: Request, email: string) => boolean = allowMessage,
) {
  const fail = (error: string, status: number) => Response.json({ ok: false, error }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "900" } : {}) },
  });
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
      return fail("Please send your message from the contact page.", 403);
    }
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return fail("Please use the contact form to send your message.", 415);
    }
    let body: unknown;
    try { body = await readBody(request); }
    catch (error) { return fail(error instanceof RangeError ? "Your message is too long." : "The message could not be read. Please try again.", error instanceof RangeError ? 413 : 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Please complete the contact form.", 400);
    const fields = body as Record<string, unknown>;
    if (fields.website) return fail("Your message could not be sent. Please email me directly.", 400);
    const name = typeof fields.name === "string" ? fields.name.trim() : "";
    const email = typeof fields.email === "string" ? fields.email.trim() : "";
    const message = typeof fields.message === "string" ? fields.message.trim() : "";
    const intent = fields.intent;
    if (name.length < 2 || name.length > 100 || HEADER_CONTROL.test(name)) return fail("Please enter your name (2–100 characters).", 400);
    if (email.length > 254 || !EMAIL.test(email) || HEADER_CONTROL.test(email)) return fail("Please enter a valid email address.", 400);
    if (message.length < 10 || message.length > 5000 || message.includes("\u0000")) return fail("Please write a message between 10 and 5,000 characters.", 400);
    if (intent !== "project" && intent !== "hire") return fail("Choose a project or hiring enquiry.", 400);
    if (!allow(request, email)) return fail("A few messages have been sent recently. Please wait 15 minutes, or email me directly.", 429);
    try { await send({ name, email, message, intent }); }
    catch (error) {
      // Never log the form content, credentials or SMTP server response.
      const code = error && typeof error === "object" && "code" in error ? String(error.code).slice(0, 30) : "MAIL_UNAVAILABLE";
      console.error("contact: email delivery failed", { code });
      return fail("Your message wasn’t sent. Please try again, or use the email link below.", 503);
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  };
}
