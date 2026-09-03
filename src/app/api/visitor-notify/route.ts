import { sendVisitorNotification } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Route handlers aren't cached by default (see Next's Route Handlers guide),
// which is what we want here — every POST should actually run and send.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, page, referrer, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a hidden field real visitors never see or fill. A bot that
  // fills every input trips it — respond success and quietly drop it.
  if (typeof company === "string" && company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const cleanName = typeof name === "string" ? name.trim().slice(0, 120) : "";
  const cleanEmail = typeof email === "string" ? email.trim().slice(0, 200) : "";

  if (!cleanName || !EMAIL_RE.test(cleanEmail)) {
    return Response.json({ ok: false, error: "A valid name and email are required." }, { status: 400 });
  }

  try {
    await sendVisitorNotification({
      name: cleanName,
      email: cleanEmail,
      page: typeof page === "string" ? page.slice(0, 300) : undefined,
      referrer: typeof referrer === "string" ? referrer.slice(0, 300) : undefined,
    });
    return Response.json({ ok: true });
  } catch (err) {
    // SMTP not configured yet, or a delivery hiccup — that's a "me" problem,
    // not the visitor's, so log it server-side and still let their modal
    // close on a friendly note instead of surfacing an error.
    console.error("visitor-notify: failed to send notification email", err);
    return Response.json({ ok: true });
  }
}
