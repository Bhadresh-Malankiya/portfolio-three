export type ChapterIcon =
  | "sprout"
  | "graduation-cap"
  | "code"
  | "building"
  | "activity"
  | "terminal"
  | "trending-up"
  | "sheet"
  | "sparkles"
  | "inbox"
  | "flame"
  | "chart"
  | "users"
  | "compass";

export type Chapter = {
  id: string;
  number: string; // roman numeral, "0" for foreword
  title: string;
  era: string;
  quote: string;
  summary: string;
  body: string[];
  icon: ChapterIcon;
};

export const foreword = {
  title: "Why I'm Writing This Down",
  quote: "Close enough to be true, far enough to be useful.",
  body: [
    'I have spent most of my adult life building things that other people use without ever thinking about the person who built them. A form loads in under a second, an exam runs without a single glitch, a support ticket gets answered before the customer has finished their coffee, and nobody claps. That is what "it works" means. The absence of complaint is the applause, and you learn, slowly, to hear it that way.',
    "This is not a story about a straight line. There is a college placement season that went better than I expected, a first job that taught me more than any course did, a pandemic that became an opening instead of a setback, a genuine detour into cybersecurity that never became my career but shaped how I think about every system I've built since, a leadership role I grew into rather than arrived in fully formed, two products I built and own outside of anyone else's permission, and one startup that did not survive a year. I'm including that startup in as much detail as the ones that worked, because leaving it out would make this a highlight reel instead of a record.",
  ],
};

export const chapters: Chapter[] = [
  {
    id: "roots",
    icon: "sprout",
    number: "I",
    title: "Roots — Growing Up in Surat",
    era: "Childhood · Surat",
    quote:
      "Surat never taught me that a good product sells itself. It taught me the opposite, every single day.",
    summary:
      "Surat's business instinct — build it, sell it, improve it, build the next thing — was the air I grew up in. I didn't come from a family of engineers. I had ordinary access to a computer and an unreasonable amount of patience for staring at a broken thing until it worked.",
    body: [
      "I did not come from a family of engineers or a school with a famous computer lab. What I had was ordinary access to a computer at a reasonable age, and an unreasonable amount of patience for figuring out why something was not working the way I expected it to. That patience is, in hindsight, most of what the job actually is.",
      "Gujarat's business culture gave me a native comfort with the idea that a product needs a market, not just a clever build. Nobody owes you attention just because you built something interesting. Somebody has to want it.",
      "The most important thing about this period was not any specific skill. It was the formation of a default mode I still operate in today: when something interests me, I do not wait for someone to assign it to me. I start.",
    ],
  },
  {
    id: "distinction-years",
    icon: "graduation-cap",
    number: "II",
    title: "The Distinction Years — College and the Placement Season",
    era: "2014 – 2018 · GTU, SSGEC",
    quote:
      "A 9.0 CGPA didn't make me employable. Four straight years of refusing to cut corners did.",
    summary:
      "B.E. in Information Technology, CGPA 9.0/10, First Class with Distinction — and the highest placement package offered in my batch. Not from one brilliant semester, but from treating consistency, quietly, as a competitive advantage.",
    body: [
      "College, for me, was less about any single brilliant class and more about a compounding routine. I was not the student who crammed the night before and pulled off a miracle. I was the student who treated consistency as a competitive advantage.",
      "The placement season is where that accumulation showed its return. I received the highest package offered to any student in my college that year — the first piece of external evidence that the way I'd chosen to spend my college years mapped to something the market valued.",
      "Do not wait for placement season to start caring about how you spend your time. By the time it arrives, the work is already done, one way or the other.",
    ],
  },
  {
    id: "cracking-the-code",
    icon: "code",
    number: "III",
    title: "Cracking the Code — DSA, Interviews, and the First Offer",
    era: "2018 · First offer",
    quote:
      "I didn't beat my first interview with talent. I beat it with the same handful of problems, solved two hundred times, until none of them looked new anymore.",
    summary:
      'DSA prep was repetition with attention — pattern recognition across arrays, trees, graphs, and dynamic programming until a "novel" problem was just a familiar shape in a different costume. Landed the first offer at HQ Infosystem.',
    body: [
      "A large percentage of the DSA you grind through for interviews will not appear in your daily work in anything like the form you studied it. It still matters enormously, because it's testing whether you can hold a problem in your head, break it into smaller correct pieces, and reason clearly under mild pressure.",
      "I made a habit, well before my real interviews, of talking through problems out loud to an empty room. It felt strange the first several times. By the time I was doing it in front of an actual person, the strangeness had already been spent safely, where nothing was at stake.",
      "Depth beats breadth in the early stages. Explain your thinking before you write a single line of code. Get comfortable being wrong out loud. Treat every rejection as data, not judgment.",
    ],
  },
  {
    id: "learning-to-build",
    icon: "building",
    number: "IV",
    title: "Learning to Build — The HQ Infosystem Years",
    era: "2018 – 2022 · Full Stack → Senior Full Stack Developer",
    quote:
      "Fifteen client projects taught me the same lesson fifteen times: edtech, logistics, and fintech are the same problem, wearing three different costumes.",
    summary:
      "Fifteen-plus full-stack applications across edtech, logistics, fintech, and e-commerce. Payment integrations with Stripe, Razorpay, and Twilio. REST APIs handling 50K+ daily requests. The years where scale stopped being a textbook idea.",
    body: [
      "I remember the first time I integrated a payment provider properly, rather than just following a tutorial's happy path, and realizing how much of the real work has almost nothing to do with the successful transaction. The successful transaction is the easy ten percent.",
      "I built Stripe Connect multi-vendor payout systems, which forced me to think carefully about money moving between parties. Every edge case stops being theoretical when a bug means someone's actual income.",
      "I cut API response times by 45% through caching and query optimization, and held Jest coverage above 85% on the modules that mattered most. Performance and reliability are not features you add at the end — they're habits you build in from the start.",
    ],
  },
  {
    id: "corona-advantage",
    icon: "activity",
    number: "V",
    title: "The Corona Advantage",
    era: "2020 – 2021 · The slow period",
    quote:
      "A crisis doesn't ask if you're ready. It only asks what you do next.",
    summary:
      "Instead of waiting out one of the worst hiring environments in recent memory, I went deeper into frameworks and tools I'd only used at a surface level — no deadline, no client, just depth. The difference showed up later, when the market recovered.",
    body: [
      "It meant building small things purely to understand them, with no deadline and no client waiting — a completely different kind of learning than building under pressure to ship. None of it produced anything dramatic in the moment.",
      "Any period that looks like a career setback, if you still have your hands and your evenings, is also a period nobody is watching closely. That lack of scrutiny is not a curse. It's room to work on the things you'd otherwise never prioritize.",
      "Slow markets are not the enemy of a career, only the enemy of a passive one.",
    ],
  },
  {
    id: "kali-linux-nights",
    icon: "terminal",
    number: "VI",
    title: "Kali Linux Nights — A Cybersecurity Detour",
    era: "2021 – 2022 · Nights and weekends",
    quote:
      "I fell in love with breaking things a full year before it occurred to me that someone might pay me to do it.",
    summary:
      "A self-directed pull toward understanding how systems fail. Top 6% Global Rank on TryHackMe in 2021, Advent of Cyber certified in 2022. Never became the career — became a permanent second lens underneath every architecture decision since.",
    body: [
      "I started thinking the way an attacker thinks: where does this system trust input it shouldn't, where does this authentication flow have a gap, where does this API leak more than it should to someone patient enough to look.",
      "I never fully crossed over into cybersecurity as a career path, even loving the work. My home situation needed steady, dependable income, not the front-loaded-with-risk economics of independent security research. I kept it as a serious interest instead of a pivot.",
      "When I built HelpDesk AI's mailbox credential handling with AES-256 encryption, that design didn't come purely from best practice. It came from months of Kali Linux nights spent thinking about how credential storage gets exploited when it's built carelessly.",
    ],
  },
  {
    id: "the-jump",
    icon: "trending-up",
    number: "VII",
    title: "The Jump — Becoming a Tech Lead at ExpressTech",
    era: "2022 – Present · Senior Software Engineer / Technical Lead",
    quote:
      "Nobody promoted me into leadership. I just started making the decisions nobody else wanted to own, and the title eventually agreed with me.",
    summary:
      "The shift from developer to lead isn't a shift in code difficulty — it's a shift in how many decisions other people are waiting on you to make, and how far a wrong one travels. Mentored 5+ engineers, scaled systems to 100K concurrent users at 99.8% uptime.",
    body: [
      "As an individual contributor, a bad choice mostly costs you time. As a technical lead, a bad choice can cost your whole team time, and if it reaches production, real money and real trust with customers.",
      "I pushed Jest coverage above 90% and layered in Cypress end-to-end tests — not because coverage numbers are inherently meaningful, but because getting a team to care about coverage is really getting them to care about whoever maintains this code next. That cut our bug escape rate by 75%.",
      "Leadership in engineering is mostly the discipline of making the invisible work visible enough that your team can trust it exists.",
    ],
  },
  {
    id: "owning-extendedforms",
    icon: "sheet",
    number: "VIII",
    title: "Owning ExtendedForms.io",
    era: "2022 – Present · Sole technical owner",
    quote:
      "401,000 users don't know or care that I own this product. They only notice when the page loads in 1.2 seconds instead of 3.2.",
    summary:
      "A Google Forms analytics and AI extension platform, now at 401K+ users, 579K forms, 8.7M respondents, 3x revenue growth. Every architecture, performance, and roadmap decision starts and ends with me.",
    body: [
      "When I say I own this product technically, decisions about architecture, performance, and where engineering effort goes next do not get handed to me from someone else's roadmap. They start with me.",
      "I rebuilt performance-critical paths, taking page load from 3.2s to 1.2s, and later cut our highest-traffic page from 30–35 seconds down to 5–6 using smarter caching and TanStack Query. Nobody filed a ticket demanding it. I noticed it, and treated it as urgent because I was the one who'd live with the consequences of ignoring it.",
      "The feature I'm proudest of is AI Watchers with face detection, protecting exam integrity. It required thinking hard about false positives — about the difference between a feature that's technically accurate and one that's fair to the student on the other end of it.",
    ],
  },
  {
    id: "building-quzo",
    icon: "sparkles",
    number: "IX",
    title: "Building Quzo.ai From Nothing",
    era: "2022 – Present · Built solo, from scratch",
    quote:
      "I gave a machine the job of writing exam questions. It took thirty seconds. It used to take thirty minutes, and none of those minutes were mine to spare.",
    summary:
      "An AI-first exam and quiz platform with proctoring, now handling 400K+ student exams. No employer's budget, no one else's decision — it exists because I decided it should, and then built it, model-agnostic across OpenAI, Claude, and Gemini.",
    body: [
      "I built a credit management and optimization system that lets the underlying AI model be selected based on task and cost — rather than locking the whole product to a single provider's pricing curve. I didn't fully appreciate how important that decision was until later.",
      "A retrieval-augmented generation pipeline on pgvector powers AI-generated question banks: what used to take an educator thirty minutes now takes about thirty seconds.",
      "I was an early adopter of AI-native dev tools — v0, Windsurf, Cursor, Antigravity, Claude Code — and set up custom agent rules and workflows so specific agents handle specific functions. The skill wasn't doing the work faster myself. It was getting a capable but not fully autonomous entity to produce reliably good outcomes.",
    ],
  },
  {
    id: "weekends-that-mattered",
    icon: "inbox",
    number: "X",
    title: "Weekends That Mattered — HelpDesk AI and the Side-Project Habit",
    era: "Weekends · Alongside the full-time role",
    quote:
      "Nobody assigned me a support ticket problem. I just couldn't stand watching a customer wait two days for something a weekend could fix.",
    summary:
      "A multi-tenant AI support agent platform, built entirely on weekends for no reason except curiosity. Cuts support engineer time by ~90%; tickets resolved in hours instead of one to two days.",
    body: [
      "Most support tickets follow recognizable patterns, and a well-designed system can recognize those patterns and resolve or route them instantly instead of making a customer wait in a queue.",
      "I built it multi-tenant from the start: per-client subdomains, JWT-based data isolation, AES-256 encrypted mailbox credentials, and a dedicated WatcherManager reliably watching each mailbox over IMAP. None of that complexity was required by any contract. I built it that way because anything less wouldn't have been something I was proud to call finished.",
      "A weekend spent building something real is a specific kind of rest for me. There's a particular clarity that comes from being completely, unambiguously in charge, from the first architectural decision to the smallest naming choice.",
    ],
  },
  {
    id: "mb-systems",
    icon: "flame",
    number: "XI",
    title: "MB Systems — Founding, Failing, and What It Taught Me",
    era: "2020 – 2022 · Founder",
    quote:
      "A startup doesn't fail in one dramatic moment. It fails the same quiet way it almost succeeds: one ordinary week at a time.",
    summary:
      "A startup studio in Surat, run alongside my full-time development work. Built the BPS crypto trading platform (10K+ users, $2M+ volume) and trained 6–7 interns, all now well-settled. The studio later closed. It did not survive — and I'm not going to pretend otherwise.",
    body: [
      "As an employee, even a technical lead, you're shielded from a lot of market reality by the structure around you. As a founder, there's no structure between you and the market's actual response to what you built. Demand does not arrive because you worked hard.",
      "I took on data and security decisions personally, as the person ultimately accountable. That single shift, from shared accountability to personal accountability, changed how carefully I thought about every technical decision — and it's stayed with me since.",
      "The studio closed because cash runway, the time I could realistically devote alongside a demanding full-time role, and market timing didn't line up. No single dramatic mistake explains it better than that unglamorous combination. I don't regret that period. I'd be lying if I said the ending didn't sting. Both are true.",
    ],
  },
  {
    id: "the-craft",
    icon: "chart",
    number: "XII",
    title: "The Craft — Charts, Maps, and Chasing New Tools",
    era: "Ongoing",
    quote:
      "A chart that lags is the only kind of slow database a user can actually see with their own eyes.",
    summary:
      "Years with Highcharts rendering millions of points without grinding to a halt, Mapbox geofencing and live tracking, Three.js for embedded 3D, Framer Motion and Lenis for interface feel. The skill that compounds isn't any one tool — it's becoming fluent in the next one, fast.",
    body: [
      "A database can be slow in ways a user never sees. A chart's performance is the user's direct, visible experience of whether your engineering is any good — there's nowhere to hide a slow chart.",
      "Building a reliable geofencing system sounds like comparing coordinates. In practice it means accounting for GPS drift, debouncing a signal that flickers across a boundary, and making sure a temporary loss of signal doesn't silently break the whole feature.",
      'The willingness to treat "I don\'t know this tool yet" as a temporary and uninteresting fact, rather than a real barrier, is one of the more important instincts in this entire book.',
    ],
  },
  {
    id: "leading-without-a-title",
    icon: "users",
    number: "XIII",
    title: "Leading Without a Title — Mentorship Lessons",
    era: "Ongoing · 12+ engineers mentored",
    quote:
      "The fastest way to help someone is to hand them the answer. The only way to actually help them is to resist that urge.",
    summary:
      "Good mentorship isn't transferring your own solution to someone else's problem. It's building the muscle in someone else to arrive at solutions like it on their own — even when, especially when, it would be faster to just tell them.",
    body: [
      "People trust a codebase's standards faster when they can see a leader hold themselves to the same standard first, rather than simply enforce it on others.",
      "Mentoring interns at MB Systems during a genuinely difficult, resource-constrained year taught me the most about patience under pressure — a much harder test of your actual values than mentoring when things are comfortable.",
      "Leadership doesn't require a title. The habits — patience, explaining reasoning rather than just conclusions, modeling the standard rather than only demanding it — are ones you can start building the moment you know something someone else doesn't yet.",
    ],
  },
  {
    id: "whats-next",
    icon: "compass",
    number: "XVI",
    title: "What's Next",
    era: "Now",
    quote:
      "I don't know what I'm building next. I know exactly how I'll start: badly, immediately, and without waiting to feel ready.",
    summary:
      "ExtendedForms.io keeps growing. Quzo.ai keeps handling more exams every term. MB Systems is closed, and its lessons are still being processed with each new decision. No tidy resolution — just a clear statement of what comes next.",
    body: [
      "I want to keep building the kind of judgment that comes from thinking like a business owner even when my formal role is purely technical — that dual lens is the source of most of the decisions in this story I'm still glad I made.",
      "I want to keep the security-minded lens from the Kali Linux years alive in everything I build, even though it never became a formal career.",
      "The habit this whole story has really been about: starting things before I'm fully ready, on the theory that readiness is mostly built in the act of starting rather than achieved in advance of it.",
    ],
  },
];
