export type AvatarMood = "welcome" | "thinking" | "proud" | "curious" | "grateful" | "wave";
export type CompanionChapter = { id: string; selector: string; label: string; number: string; mood: AvatarMood; note: string; };

export const companionChapters: CompanionChapter[] = [
  { id: "hello", selector: "#hero", label: "The beginning", number: "01", mood: "welcome", note: "Hi, I’m Bhadresh. Let me show you around." },
  { id: "work", selector: "#work", label: "Web products", number: "02", mood: "proud", note: "From a first question to something people use." },
  { id: "mobile", selector: "#mobile-work", label: "In your pocket", number: "03", mood: "curious", note: "This one’s for pets. And the people who love them." },
  { id: "workbench", selector: "#workbench, .workbench", label: "The workbench", number: "04", mood: "thinking", note: "Different problems keep me curious." },
  { id: "about", selector: "#about", label: "The human part", number: "05", mood: "welcome", note: "A few detours made me the builder I am today." },
  { id: "experience", selector: "#experience", label: "Along the way", number: "06", mood: "thinking", note: "The lessons stayed, even when the plans changed." },
  { id: "expertise", selector: "#expertise", label: "In my toolkit", number: "07", mood: "curious", note: "I like knowing how the whole thing works." },
  { id: "reviews", selector: "#reviews", label: "Their words", number: "08", mood: "grateful", note: "I’ll let the people I’ve worked with take this bit." },
  { id: "downloads", selector: "#downloads", label: "Take a page", number: "09", mood: "proud", note: "The short version is my CV. The longer one’s a book." },
  { id: "contact", selector: "#contact", label: "Your next idea", number: "10", mood: "wave", note: "Got something in mind? I’d like to hear it." },
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

export function getCompanionChapter(pathname: string): CompanionChapter {
  if (pathname === "/") return companionChapters[0];
  if (pathname === "/projects") return projectDirectoryChapter;
  if (pathname === "/journey" || pathname.startsWith("/journey/")) return journeyChapter;
  if (pathname === "/field-guide" || pathname.startsWith("/field-guide/")) return fieldGuideChapter;
  return projectChapter;
}
