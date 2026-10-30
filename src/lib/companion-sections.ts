export type AvatarMood = "welcome" | "thinking" | "proud" | "curious" | "grateful" | "wave";
export type CompanionChapter = { id: string; selector: string; label: string; number: string; mood: AvatarMood; note: string; target?: string; side?: "left" | "right"; };

export const companionChapters: CompanionChapter[] = [
  { id: "hello", selector: "#hero", label: "Hello, I’m Bhadresh", number: "01", mood: "welcome", note: "Call me or WhatsApp me any time. The buttons are bottom left.", target: "#hero h1" },
  { id: "work", side: "left", selector: "#work", label: "Made it to the real world", number: "02", mood: "proud", note: "Three different problems. Open a project to see how I solved it.", target: "#work h3" },
  { id: "mobile", selector: "#mobile-work", label: "A smaller screen", number: "03", mood: "curious", note: "Driver routing, pet tracking and live trading, built for the phone.", target: "#mobile-work h3" },
  { id: "workbench", selector: "#workbench, .workbench", label: "Still curious?", number: "04", mood: "thinking", note: "There’s more on the workbench. Pick something that interests you.", target: "#workbench a" },
  { id: "about", selector: "#about", label: "A little about me", number: "05", mood: "welcome", note: "This is the other half: the person behind the projects.", target: ".journal-heading h2" },
  { id: "experience", selector: "#experience", label: "How I got here", number: "06", mood: "thinking", note: "From developer to technical lead. Tap a role to see what I owned.", target: "#experience h3" },
  { id: "expertise", selector: "#expertise", label: "Joining the dots", number: "07", mood: "curious", note: "Interfaces, systems, AI, and the team that brings them together.", target: "#expertise h3" },
  { id: "contact", selector: "#contact", label: "Your turn", number: "08", mood: "wave", note: "Call me, WhatsApp me or send an email. Whatever is easiest.", target: "#contact a" },
];

export const projectChapter: CompanionChapter = {
  id: "project", selector: "main", label: "Inside the work", number: "↗", mood: "thinking", note: "A closer look at what we built, and why.",
};

const projectDirectoryChapter: CompanionChapter = {
  id: "projects", selector: "main", label: "More to explore", number: "↗", mood: "curious", note: "Pick a project. There’s a different problem behind each one.",
};
const fieldGuideChapter: CompanionChapter = {
  id: "field-guide", selector: "main", label: "For your journey", number: "↗", mood: "welcome", note: "A few notes on interviews and finding your first engineering role.",
};
const contactChapter: CompanionChapter = {
  id: "contact-page", selector: "main", label: "Over to you", number: "↗", mood: "wave", note: "Call me, WhatsApp me or write. I reply fast.",
};

export function getCompanionChapter(pathname: string): CompanionChapter {
  if (pathname === "/") return companionChapters[0];
  if (pathname === "/contact") return contactChapter;
  if (pathname === "/projects") return projectDirectoryChapter;
  if (pathname === "/field-guide" || pathname.startsWith("/field-guide/")) return fieldGuideChapter;
  return projectChapter;
}
