"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, BriefcaseBusiness, Check, LoaderCircle, Send } from "lucide-react";
import { profile } from "@/data/profile";

type Intent = "project" | "hire";
type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const resetFocusRef = useRef(false);
  const sendingRef = useRef(false);
  const [intent, setIntent] = useState<Intent>("hire");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (status === "sent") successHeadingRef.current?.focus();
    if (status === "idle" && resetFocusRef.current) {
      resetFocusRef.current = false;
      formRef.current?.querySelector<HTMLInputElement>('input[name="intent"]')?.focus();
    }
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      message: String(values.get("message") ?? "").trim(),
      intent,
      website: String(values.get("website") ?? ""),
    };
    const issues: FieldErrors = {};
    if (payload.name.length < 2 || payload.name.length > 100) issues.name = "Please enter a name between 2 and 100 characters.";
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    if (!payload.email || payload.email.length > 254 || !emailInput.validity.valid) issues.email = "Please enter a valid email so I can reply.";
    if (payload.message.length < 10 || payload.message.length > 5000) issues.message = "Please write a little more — between 10 and 5,000 characters.";
    setErrors(issues);
    setSendError("");
    const firstInvalid = (Object.keys(issues) as Field[])[0];
    if (firstInvalid) {
      setStatus("idle");
      (form.elements.namedItem(firstInvalid) as HTMLInputElement | HTMLTextAreaElement).focus();
      return;
    }

    sendingRef.current = true;
    setStatus("sending");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || result?.ok !== true) {
        throw new Error(typeof result?.error === "string" ? result.error : "Your message couldn’t be sent. Please try again, or email me directly.");
      }
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setSendError(error instanceof Error && error.name !== "AbortError" && error.name !== "TypeError" ? error.message : "I couldn’t confirm that your message was sent. Your note is still here — please try again, or email me directly.");
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
    }
  }

  function clearError(field: Field) {
    if (errors[field]) setErrors(previous => ({ ...previous, [field]: undefined }));
  }

  return (
    <div className="contact-form-content">
      {status === "sent" ? (
        <div className="contact-success" role="status" aria-live="polite">
          <span className="contact-success-icon" aria-hidden="true"><Check size={30} strokeWidth={1.5} /></span>
          <p className="contact-small-label">A good place to start</p>
          <h2 ref={successHeadingRef} tabIndex={-1}>Your note is on its way.</h2>
          <p>Thanks for reaching out. I’ll reply to the email address you shared.</p>
          <button type="button" className="contact-reset" onClick={() => { resetFocusRef.current = true; setStatus("idle"); setIntent("hire"); setErrors({}); }}>Write another note <ArrowUpRight size={16} aria-hidden="true" /></button>
        </div>
      ) : (
        <form ref={formRef} className="contact-form" method="post" action="/api/contact" onSubmit={submit} noValidate aria-busy={status === "sending"}>
          <fieldset className="contact-intents" disabled={status === "sending"}>
            <legend>I’m here because…</legend>
            <div className="contact-intent-options">
              <label className={intent === "hire" ? "is-selected" : undefined}>
                <input type="radio" name="intent" value="hire" checked={intent === "hire"} onChange={() => setIntent("hire")} />
                <span>I’m hiring for a role</span><BriefcaseBusiness size={17} aria-hidden="true" />
              </label>
              <label className={intent === "project" ? "is-selected" : undefined}>
                <input type="radio" name="intent" value="project" checked={intent === "project"} onChange={() => setIntent("project")} />
                <span>Something else</span><ArrowUpRight size={17} aria-hidden="true" />
              </label>
            </div>
          </fieldset>
          <div className="contact-fields-row">
            <div className="contact-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={status === "sending"} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={() => clearError("name")} />{errors.name && <p id="contact-name-error" className="contact-field-error">{errors.name}</p>}</div>
            <div className="contact-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} disabled={status === "sending"} aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={() => clearError("email")} />{errors.email && <p id="contact-email-error" className="contact-field-error">{errors.email}</p>}</div>
          </div>
          <div className="contact-field contact-message"><label htmlFor="contact-message">What do you have in mind?</label><p id="contact-message-hint">{intent === "hire" ? "Tell me about the role, the team and what you’re building." : "A few lines about what you have in mind."}</p><textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={5000} disabled={status === "sending"} aria-invalid={!!errors.message} aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`} onChange={() => clearError("message")} />{errors.message && <p id="contact-message-error" className="contact-field-error">{errors.message}</p>}</div>
          <div className="contact-honey" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
          {status === "error" && <div className="contact-send-error" role="alert"><p>{sendError}</p><a href={`mailto:${profile.email}`}>Email {profile.email} <ArrowUpRight size={14} aria-hidden="true" /></a></div>}
          <div className="contact-submit-row"><p>Just the essentials.<br /> All three fields are required.</p><button type="submit" disabled={status === "sending"}>{status === "sending" ? <>Sending <LoaderCircle size={17} className="contact-spinner" aria-hidden="true" /></> : <>Send your note <Send size={17} strokeWidth={1.5} aria-hidden="true" /></>}</button></div>
          <span className="contact-status" role="status" aria-live="polite">{status === "sending" ? "Sending your message. Please wait." : ""}</span>
        </form>
      )}
      <noscript><style>{".contact-form{display:none}"}</style><p className="contact-no-script">Please enable JavaScript to send this form, or <a href={`mailto:${profile.email}`}>email me directly</a>.</p></noscript>
    </div>
  );
}
