/**
 * The two take-home artifacts, rendered from `source-material/` (see
 * README) into selectable-text PDFs at `public/downloads/`. Measure sizes
 * and page counts again whenever the documents are regenerated.
 */
export const downloads = {
  ebook: {
    kicker: "The memoir",
    title: "The Weekend Builder",
    subtitle: "A Life in Code, Ownership, and the Habit of Starting Again",
    file: "/downloads/the-weekend-builder.pdf",
    filename: "The-Weekend-Builder-Bhadreshkumar-Malankiya.pdf",
    sizeLabel: "480 KiB",
    pages: 87,
    stats: ["Foreword + 16 chapters", "87 pages", "~20,000 words"],
    cta: "Download the book",
  },
  resume: {
    kicker: "The résumé",
    title: "Bhadreshkumar Malankiya",
    subtitle: "Senior Full-Stack Engineer · Node.js, TypeScript & Applied AI",
    file: "/downloads/bhadreshkumar-malankiya-resume.pdf",
    filename: "Bhadreshkumar-Malankiya-Resume.pdf",
    sizeLabel: "7 KiB",
    pages: 2,
    stats: ["2 pages", "8+ years, condensed"],
    cta: "Download the résumé",
  },
} as const;
