import { profile } from "@/data/profile";

const digits = profile.phone.replace(/\D/g, "");

export const phoneHref = `tel:+${digits}`;
export const whatsappMessage = "Hi Bhadresh, I saw your portfolio and would like to talk about a role.";
export const whatsappHref = `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage)}`;
export const mailHref = `mailto:${profile.email}`;
