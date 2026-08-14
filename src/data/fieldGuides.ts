export type GuideSection = {
  heading: string;
  body: string;
};

export type FieldGuide = {
  slug: string;
  title: string;
  eyebrow: string;
  quote: string;
  intro: string;
  sections: GuideSection[];
};

export const fieldGuides: FieldGuide[] = [
  {
    slug: "cracking-dsa-and-interviews",
    title: "A Field Guide to Cracking DSA and Technical Interviews",
    eyebrow: "Chapter XIV",
    quote: "You don't crack an interview in the room. You crack it in the two hundred problems nobody ever watched you solve.",
    intro:
      "Written directly to whoever is preparing for their own interviews — the exact things I wish someone had told me plainly, without the vague encouragement that fills most advice on this topic.",
    sections: [
      {
        heading: "Start with the shapes, not the problems",
        body: "There's a genuinely small number of underlying patterns behind the enormous volume of practice problems online: two-pointer techniques, sliding windows, breadth-first and depth-first traversal, dynamic programming built on overlapping subproblems, backtracking. Organize your early practice explicitly around recognizing these shapes underneath unfamiliar descriptions. Pick a pattern, work a cluster of problems on that pattern until recognition is automatic, then move on. Random practice feels productive; structured, pattern-first practice builds transferable recognition far faster.",
      },
      {
        heading: "Talk out loud, every time, starting now",
        body: "Silent problem-solving and narrated problem-solving are genuinely different skills, and an interview only tests the second. Record yourself narrating a solution occasionally and listen back — almost everyone is surprised how much less clear their spoken reasoning is than it felt inside their own head.",
      },
      {
        heading: "Get comfortable being wrong in front of someone",
        body: "You will take wrong turns in real interviews. Everyone does. What separates a strong outcome from a weak one is whether you can notice it, say so calmly, and correct course without your composure visibly collapsing. Practice the specific language: \"I'm noticing this approach won't handle this edge case cleanly, let me reconsider\" — said calmly, is a skill in itself.",
      },
      {
        heading: "Understand tradeoffs, not just labels",
        body: "An interviewer asking about complexity is rarely testing whether you can name it. They're testing whether you understand why it is what it is, and whether you can identify a different approach with a different tradeoff if the constraints changed. Practice by asking what happens to your solution's complexity if the input were ten times larger, or if memory were far more constrained than time.",
      },
      {
        heading: "Mock interviews are not optional",
        body: "The specific pressure of being watched while thinking has to be practiced directly, the same way public speaking does even by someone who knows their material cold. The discomfort of doing this a handful of times in low-stakes practice is dramatically cheaper than experiencing it for the first time in an interview that actually matters.",
      },
      {
        heading: "Treat rejection as data, not verdict",
        body: "I did not pass every interview I ever sat for. Nobody who has interviewed extensively has. The engineers who improve fastest extract a specific, actionable lesson from a rejection rather than absorbing it as a broad judgment about their overall ability.",
      },
      {
        heading: "Don't skip system design and behavioral rounds",
        body: "At a first-job level, system design rounds test whether you can reason clearly about tradeoffs at a small, honest scale — not whether you can architect a global platform. Behavioral rounds test whether you can describe a real situation honestly, with a clear account of what you did and learned. Prepare two or three genuine stories, even from college projects, and tell them clearly rather than searching for a more impressive one.",
      },
    ],
  },
  {
    slug: "landing-your-first-job",
    title: "A Field Guide to Landing Your First Job",
    eyebrow: "Chapter XV",
    quote: "Your first offer isn't proof that you're already excellent. It's only proof that someone was willing to bet you would be.",
    intro:
      "Landing a first job is a genuinely different problem than landing a fifth. With no track record to point to, you're asking someone to bet on potential — the entire strategy should be built around making that bet feel safe.",
    sections: [
      {
        heading: "Build proof before you need it",
        body: "A portfolio of real, working projects, even small ones, is worth more than almost anything else you can put in front of a hiring manager who's never met you. It doesn't need to be commercially successful. It needs to demonstrate you can take an idea from nothing to something that runs.",
      },
      {
        heading: "Treat academic performance as compounding, not a single event",
        body: "A strong record and a good placement outcome don't happen because of anything dramatic in a final semester. They happen from a long, unglamorous accumulation of consistent effort — available to anyone willing to start it early rather than waiting for deadline pressure.",
      },
      {
        heading: "Don't wait for the market to be favorable",
        body: "A difficult market is a reason to prepare more deliberately, never a reason to prepare less. The gap between people who used a slow period to build and people who paused becomes visible the moment the market recovers.",
      },
      {
        heading: "Talk about projects like responsibilities, not tech-stack trivia",
        body: "Instead of \"I built a project using React and Node,\" try \"I noticed this specific problem, chose this approach because of this tradeoff, and here's what I'd do differently now.\" That last part — honest reflection on what you'd improve — is disproportionately persuasive.",
      },
      {
        heading: "Apply broadly, prepare narrowly",
        body: "There's a difference between casting a wide net and treating every application with equally shallow effort. The candidates who stand out did visibly deeper homework on the small number of roles that genuinely mattered to them.",
      },
      {
        heading: "A small, genuine network beats a cold queue",
        body: "Stay in real touch with classmates, seniors, professors, and anyone who saw your actual work firsthand. A first job, more often than most people admit, arrives through some version of a real relationship rather than a cold application into an anonymous queue.",
      },
      {
        heading: "The offer is the beginning, not the finish line",
        body: "A first role's most important job is not prestige — it's giving you real, structured exposure to how software actually gets built and shipped under real constraints. Prepare for the interview seriously. Don't mistake the gate for the destination.",
      },
    ],
  },
];
