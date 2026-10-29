export type ProjectWorld = {
  paper: string;
  ink: string;
  accent: string;
  soft: string;
  signal: string;
  motif: "voice" | "jewel" | "assessment" | "forms" | "support" | "publishing" | "kiosk" | "workspace" | "market" | "medical" | "restaurant" | "pet" | "legal" | "route" | "studio";
  line: string;
  sequence: [string, string, string];
  chapter: string;
};

export const projectWorlds: Record<string, ProjectWorld> = {
  compassrt: { paper: "#e6edf0", ink: "#192d36", accent: "#2f6f86", soft: "#c7dce4", signal: "#8fd0e6", motif: "market", line: "Every tick in. One calm frame out.", sequence: ["Stream", "Buffer", "Render"], chapter: "Keeping a live market readable" },
  "project-lifecycle-agents": { paper: "#ece9f2", ink: "#2a2438", accent: "#5b4a8c", soft: "#d6cfe8", signal: "#b9a8f0", motif: "workspace", line: "Agents with one job each.", sequence: ["Research", "Plan", "Act"], chapter: "Giving each agent one job" },
  vocalxi: { paper: "#f2e9d7", ink: "#272316", accent: "#8c4d0c", soft: "#e4d2a7", signal: "#f7bb54", motif: "voice", line: "A little less typing. A little more human.", sequence: ["Ask", "Speak", "Review"], chapter: "Giving a form a voice" },
  "quzo-ai": { paper: "#eeebf7", ink: "#28223c", accent: "#574392", soft: "#d7d0ed", signal: "#b5a5f5", motif: "assessment", line: "From a question to an assessment.", sequence: ["Create", "Deliver", "Understand"], chapter: "Beyond the generated question" },
  "extendedforms-io": { paper: "#eaf0e3", ink: "#202e25", accent: "#336648", soft: "#cfdfc7", signal: "#b4d989", motif: "forms", line: "Familiar forms. More possibilities.", sequence: ["Configure", "Assess", "Report"], chapter: "Working inside a familiar workflow" },
  jewelxi: { paper: "#f3ebe1", ink: "#392a25", accent: "#915b40", soft: "#e5d0bd", signal: "#dfb793", motif: "jewel", line: "A closer look at the details.", sequence: ["Discover", "Explore", "Enquire"], chapter: "An object deserves a good introduction" },
  "hey-buddy": { paper: "#eeebf4", ink: "#332446", accent: "#695083", soft: "#d9cee7", signal: "#d7ee83", motif: "pet", line: "For the ones who wander.", sequence: ["Locate", "Follow", "Care"], chapter: "A map with someone to care about" },
  "helpdesk-ai": { paper: "#e5edf1", ink: "#19333f", accent: "#336f81", soft: "#c6dce4", signal: "#a2d3e0", motif: "support", line: "An inbox that can take the next step.", sequence: ["Receive", "Resolve", "Route"], chapter: "Making room for the harder questions" },
  zwopr: { paper: "#f1ece4", ink: "#372d27", accent: "#a34930", soft: "#e8d4c6", signal: "#ec997e", motif: "publishing", line: "Many pieces. One content workspace.", sequence: ["Organize", "Create", "Manage"], chapter: "A home for the content operation" },
  ebaggagedrop: { paper: "#efeede", ink: "#292c25", accent: "#656832", soft: "#dedebe", signal: "#ddd978", motif: "kiosk", line: "Where software meets the departure hall.", sequence: ["Measure", "Process", "Connect"], chapter: "Computer vision, out in the world" },
  webstack: { paper: "#e9eef5", ink: "#253347", accent: "#4569a1", soft: "#ccd9eb", signal: "#a5c4f2", motif: "workspace", line: "The work behind the work.", sequence: ["Plan", "Coordinate", "Track"], chapter: "A shared place to move work forward" },
  "bps-trading": { paper: "#e7eee9", ink: "#1a3029", accent: "#37765a", soft: "#c9dfd1", signal: "#99d6b4", motif: "market", line: "A live market does not wait.", sequence: ["Stream", "Monitor", "Trade"], chapter: "Building for a moving market" },
  "intuitive-surgical-dashboard": { paper: "#eaf0f0", ink: "#23383c", accent: "#386c77", soft: "#cbdee0", signal: "#a0d1d9", motif: "medical", line: "Clarity where the details matter.", sequence: ["Connect", "Organize", "Understand"], chapter: "Careful interfaces for complex systems" },
  "kexy-restaurants": { paper: "#f2e9dd", ink: "#382a20", accent: "#9b5130", soft: "#e8ccb3", signal: "#eda66d", motif: "restaurant", line: "Behind a busy restaurant.", sequence: ["Manage", "Connect", "Pay out"], chapter: "The systems behind the service" },
  rightful: { paper: "#e9e8ef", ink: "#2f2c42", accent: "#625889", soft: "#d4d0e4", signal: "#c4bae8", motif: "legal", line: "A clearer way to connect.", sequence: ["Find", "Connect", "Consult"], chapter: "Making a serious service approachable" },
  collahead: { paper: "#f1eadf", ink: "#342e25", accent: "#967033", soft: "#e4d4b7", signal: "#eec178", motif: "route", line: "Every moving dot has a journey.", sequence: ["Locate", "Route", "Track"], chapter: "Engineering the journey between points" },
  "freelance-agency-work": { paper: "#f0e5e7", ink: "#3d2930", accent: "#98475e", soft: "#e4c9d0", signal: "#eda5b8", motif: "studio", line: "Different businesses. Hands-on building.", sequence: ["Listen", "Build", "Deliver"], chapter: "The independent side of my work" },
};

export const getProjectWorld = (slug: string) => projectWorlds[slug] ?? projectWorlds["freelance-agency-work"];
