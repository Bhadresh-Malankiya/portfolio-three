"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";

const STORAGE_KEY = "twb-visitor-note";
const SHOW_AFTER_MS = 1600;
const AUTOCLOSE_AFTER_MS = 2200;

type Status = "idle" | "sending" | "sent" | "error";

/**
 * A one-time, dismissible "who's visiting?" note — not a newsletter gate.
 * Shows once per browser (localStorage), a beat after the page settles so it
 * never blocks first paint, and never comes back once skipped or submitted.
 */
export default function VisitorWelcomeModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alreadySeen = true;
    try {
      alreadySeen = !!window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage blocked (private mode, locked-down browser) — treat as unseen
      // for this visit rather than throwing; worst case it can show again.
      alreadySeen = false;
    }
    if (alreadySeen) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  function remember() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to do if storage isn't available — it'll just ask again.
    }
  }

  function close() {
    remember();
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const honeypot = String(form.get("company") || "");

    if (!name.trim() || !email.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/visitor-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: honeypot,
          page: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
      remember();
      window.setTimeout(() => setOpen(false), AUTOCLOSE_AFTER_MS);
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-ink/75 px-4 py-8 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="visitor-note-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto max-h-[calc(100dvh-4rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-line-strong bg-ink-2/95 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.8)] backdrop-blur"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--color-gold), transparent 70%)" }}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink-3 hover:text-fg"
            >
              <X size={16} />
            </button>

            <div className="relative px-6 pb-6 pt-7 sm:px-7">
              {status === "sent" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Check size={20} />
                  </span>
                  <p className="mt-4 font-display text-lg text-fg">
                    Thanks{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""} — appreciate you stopping by.
                  </p>
                  <p className="mt-1.5 text-sm text-muted">Back to scrolling.</p>
                </div>
              ) : (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">Hey, welcome 👋</p>
                  <h2 id="visitor-note-heading" className="mt-3 text-balance font-display text-2xl leading-tight text-fg">
                    Who do I have the pleasure of hosting?
                  </h2>
                  <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted">
                    No newsletter, no spam — I just like knowing who stops by and what they&apos;re building. Totally
                    optional; skip it and keep exploring if you&apos;d rather.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    {/* Honeypot — hidden from real visitors, catches bots that fill every field. */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <input
                      ref={firstFieldRef}
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      maxLength={120}
                      className="w-full rounded-lg border border-line bg-ink-3/60 px-4 py-2.5 text-sm text-fg placeholder:text-muted/70 outline-none transition-colors focus:border-gold"
                    />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                      maxLength={200}
                      className="w-full rounded-lg border border-line bg-ink-3/60 px-4 py-2.5 text-sm text-fg placeholder:text-muted/70 outline-none transition-colors focus:border-gold"
                    />

                    {status === "error" && (
                      <p className="text-xs text-gold-bright">Didn&apos;t go through — mind trying again?</p>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <button
                        type="button"
                        onClick={close}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
                      >
                        Maybe later
                      </button>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
                      >
                        {status === "sending" ? "Sending…" : "Say hi"}
                        {status !== "sending" && (
                          <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
