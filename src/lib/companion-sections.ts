export type AvatarMood = "welcome" | "thinking" | "proud" | "curious" | "grateful" | "wave";
export type CompanionChapter = { id: string; selector: string; label: string; number: string; mood: AvatarMood; note: string; side?: "left" | "right"; };

export const companionChapters: CompanionChapter[] = [
  { id: "hello", selector: "#hero", label: "The beginning", number: "01", mood: "welcome", note: "Scroll to follow the idea." },
  { id: "work", side: "left", selector: "#work", label: "Web products", number: "02", mood: "proud", note: "Three products. Start here." },
  { id: "mobile", selector: "#mobile-work", label: "In your pocket", number: "03", mood: "curious", note: "Take a closer look at the app." },
  { id: "workbench", selector: "#workbench, .workbench", label: "The workbench", number: "04", mood: "thinking", note: "A few more things I’ve built." },
  { id: "about", side: "left", selector: "#about", label: "The human part", number: "05", mood: "welcome", note: "The person behind the work." },
  { id: "experience", selector: "#experience", label: "Along the way", number: "06", mood: "thinking", note: "Follow the steps that got me here." },
  { id: "expertise", side: "left", selector: "#expertise", label: "In my toolkit", number: "07", mood: "curious", note: "See how the pieces connect." },
  { id: "reviews", selector: "#reviews", label: "Their words", number: "08", mood: "grateful", note: "Hear from the people I work with." },
  { id: "downloads", selector: "#downloads", label: "Take a page", number: "09", mood: "proud", note: "Take my CV or a book with you." },
  { id: "contact", selector: "#contact", label: "Your next idea", number: "10", mood: "wave", note: "Your next idea starts here." },
];

export const projectChapter: CompanionChapter = {
  id: "project", selector: "main", label: "Inside the work", number: "↗", mood: "thinking", note: "A closer look at what we built, and why.",
};

const projectDirectoryChapter: CompanionChapter = {
  id: "projects", selector: "main", label: "More to explore", number: "↗", mood: "curious", note: "Pick a project. There’s a different problem behind each one.",
};
const journeyChapter: CompanionChapter = {
  id: "journey", selector: "main", label: "The longer story", number: "↗", mood: "thinking", note: "The starts, the detours, and the lessons I kept. In sixteen chapters.",
};
const fieldGuideChapter: CompanionChapter = {
  id: "field-guide", selector: "main", label: "For your journey", number: "↗", mood: "welcome", note: "A few notes on interviews and finding your first engineering role.",
};
const contactChapter: CompanionChapter = {
  id: "contact-page", selector: "main", label: "Over to you", number: "↗", mood: "wave", note: "A project, a role, or a hello. Tell me what you have in mind.",
};

export function getCompanionChapter(pathname: string): CompanionChapter {
  if (pathname === "/") return companionChapters[0];
  if (pathname === "/contact") return contactChapter;
  if (pathname === "/projects") return projectDirectoryChapter;
  if (pathname === "/journey" || pathname.startsWith("/journey/")) return journeyChapter;
  if (pathname === "/field-guide" || pathname.startsWith("/field-guide/")) return fieldGuideChapter;
  return projectChapter;
}

/** The guide travels in the bottom margin; small screens keep a clear reading lane. */
export function companionDestination(chapter: CompanionChapter, width: number, height: number, downloadsVisible = false, reduced = false) {
  const mobile = width < 700;
  const left = !mobile && !reduced && chapter.side === "left";
  const lift = reduced ? 0 : mobile ? (chapter.id === "hello" ? 0 : 14) : left && downloadsVisible ? 76 : 0;
  const safeLift = Math.min(lift, Math.max(0, height - (mobile ? 100 : 180)));
  return { x: left ? -Math.max(0, width - 152) : 0, y: -safeLift, side: left ? "left" as const : "right" as const };
}
