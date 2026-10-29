/**
 * The public résumé. One canonical PDF at `public/downloads/`; the older
 * file names are identical copies kept so existing links keep working.
 */
export const downloads = {
  resume: {
    kicker: "The résumé",
    title: "Bhadresh Malankiya",
    subtitle: "Senior Full Stack Engineer · Technical Lead",
    file: "/downloads/bhadresh-malankiya-resume.pdf",
    filename: "Bhadresh-Malankiya-Resume.pdf",
    sizeLabel: "5 KiB",
    pages: 1,
    stats: ["1 page", "8+ years, focused"],
    cta: "Download the résumé",
  },
} as const;
