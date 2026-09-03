// Sourced directly from the live Upwork profile and its completed-job
// history — quotes are copied verbatim (client names aren't shown; Upwork
// keeps those private), stats match the profile snapshot. Update this file,
// not the numbers below, if the profile moves.
export type UpworkTestimonial = {
  quote: string;
  /** His reply to the client feedback, where Upwork shows one. */
  response?: string;
  job: string;
  period: string;
  rating: number;
  tags?: string[];
};

export const upwork = {
  profileUrl: "https://www.upwork.com/freelancers/bhadreshmalankiya",
  proofImage: "/images/upwork-profile-overview.jpg",

  stats: [
    { value: 10, prefix: "$", suffix: "K+", label: "total earnings" },
    { value: 12, suffix: "", label: "jobs completed" },
    { value: 1157, suffix: "", label: "hours logged" },
    { value: 5, suffix: ".0", label: "avg. rating, every rated job" },
  ],

  verifications: ["Identity verified", "Payment verified", "Military veteran"],

  bio: [
    "Every job on this profile was paid for out of a client's own pocket — no account manager, no team between us, just the work and whether it held up. Twelve jobs, five-star on every one that left a rating.",
    "The range says as much as the score: PHP/jQuery systems patched on a live deadline, a Shopify app built on Laravel + React, a two-year NextJs admin dashboard, a part-time React/Node/Cloud engagement — the same client-facing discipline that now goes into the AI SaaS and Three.js/Motion UI work below.",
  ],

  quickPraise: ['"Great work." — Easy Laravel Task', '"Great as always" — PHP module build'],

  skills: ["Laravel", "React", "Next.js", "Node.js", "Shopify Apps", "Vue.js", "MySQL", "JavaScript"],

  testimonials: [
    {
      quote: "Working fluently since the beginning of time. Excellent always",
      job: "Modification to PHP information system",
      period: "Nov 2022 – Jan 2023",
      rating: 5.0,
    },
    {
      quote: "Excellent as always, Bhadresh is the man",
      job: "Create/modify functions — PHP information system",
      period: "Aug – Oct 2022",
      rating: 5.0,
    },
    {
      quote: "Tasks are done. Everything is OK with Bhadresh. Great to work with him. Thanks.",
      response: "Thanks — your satisfaction is everything.",
      job: "AJAX functionality + button, PHP project",
      period: "Mar 2022",
      rating: 5.0,
      tags: ["Collaborative"],
    },
    {
      quote: "Excellent job, according to our needs. Fast response. Thanks.",
      response: "Thank you so much for the feedback.",
      job: "jQuery/JS/PHP developer — POS system",
      period: "Nov 2021",
      rating: 5.0,
      tags: ["Committed to quality", "Reliable"],
    },
  ] satisfies UpworkTestimonial[],
};
