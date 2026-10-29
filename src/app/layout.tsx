import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./portfolio-theme.css";
import "./exhibition.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingContactCard from "@/components/FloatingContactCard";
import FloatingDownloads from "@/components/FloatingDownloads";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { profile } from "@/data/profile";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = `https://${profile.site}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bhadresh Malankiya | Senior Full Stack Engineer & Tech Lead",
    template: "%s | Bhadresh Malankiya",
  },
  description: profile.summary,
  keywords: [
    "Bhadresh Malankiya",
    "Bhadreshkumar Malankiya",
    "Senior Full Stack Engineer",
    "Technical Lead",
    "Node.js",
    "React",
    "Next.js",
    "TypeScript",
    "LLM integration",
    "RAG",
    "ExtendedForms.io",
    "Quzo.ai",
    "HelpDesk AI",
    "Next.js developer portfolio",
    "AI product engineer Surat",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Bhadresh Malankiya | Senior Full Stack Engineer & Tech Lead",
    description:
      "Senior Full Stack Engineer and Tech Lead with 8+ years in Node.js, React and TypeScript. Led ExtendedForms.io (400K+ users) and built Quzo.ai. Available now.",
    type: "website",
    url: siteUrl,
    siteName: "Bhadresh Malankiya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhadresh Malankiya | Senior Full Stack Engineer & Tech Lead",
    description: profile.summary,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="relative overflow-x-clip portfolio-theme">
        <noscript><style>{`.workbench-poster{opacity:1!important;transform:none!important}.flight-story{height:auto!important}.flight-theatre{position:relative!important}`}</style></noscript>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            alternateName: profile.shortName,
            jobTitle: profile.role,
            description: profile.summary,
            url: siteUrl,
            email: `mailto:${profile.email}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: profile.location,
            },
            knowsAbout: [
              "Full Stack Development",
              "Next.js",
              "React",
              "Node.js",
              "AI Integrations",
              "Software Architecture",
              "Data Visualization",
            ],
            sameAs: [profile.linkedin, profile.github],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Bhadresh Malankiya",
            url: siteUrl,
            description: profile.summary,
            author: { "@type": "Person", name: profile.name },
          }}
        />
        <div className="grain" aria-hidden="true" />
        <SmoothScroll>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Nav />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <div className="original-artifacts">
          <FloatingContactCard />
          <FloatingDownloads />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
