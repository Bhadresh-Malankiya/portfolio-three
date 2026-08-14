/**
 * The two take-home artifacts, rendered from `source-material/` (see
 * README) into print-ready PDFs at `public/downloads/`. Sizes/page counts
 * are real — update them if the source files change and you regenerate.
 */
export const downloads = {
  ebook: {
    kicker: "The memoir",
    title: "The Weekend Builder",
    subtitle: "A Life in Code, Ownership, and the Habit of Starting Again",
    file: "/downloads/the-weekend-builder.pdf",
    filename: "The-Weekend-Builder-Bhadreshkumar-Malankiya.pdf",
    sizeLabel: "330 KB",
    stats: ["Foreword + 16 chapters", "32 pages", "~20,000 words"],
    cta: "Download the book",
  },
  resume: {
    kicker: "The résumé",
    title: "Bhadreshkumar Malankiya",
    subtitle: "Senior Full Stack Engineer · Software Architect · Technical Lead",
    file: "/downloads/bhadreshkumar-malankiya-resume.pdf",
    filename: "Bhadreshkumar-Malankiya-Resume.pdf",
    sizeLabel: "143 KB",
    stats: ["3 pages", "8+ years, condensed"],
    cta: "Download the résumé",
  },
} as const;
