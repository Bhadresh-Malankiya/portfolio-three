import { createContactHandler } from "@/lib/contact-handler";
import { sendContactMessage } from "@/lib/mailer";

export const runtime = "nodejs";
export const maxDuration = 30;
export const POST = createContactHandler(sendContactMessage);
