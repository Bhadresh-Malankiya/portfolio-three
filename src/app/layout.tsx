import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingContactCard from "@/components/FloatingContactCard";
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
    default: "The Weekend Builder — Bhadreshkumar Malankiya",
    template: "%s — The Weekend Builder",
  },
  description:
    "Senior Full Stack Engineer & Technical Lead. Sole owner of ExtendedForms.io (401K+ users) and Quzo.ai (400K+ exams). Eight years of shipping, one startup that didn't survive, and a habit of building on weekends anyway.",
  keywords: [
    "Bhadreshkumar Malankiya",
    "Full Stack Engineer",
    "Technical Lead",
    "Software Architect",
    "ExtendedForms.io",
    "Quzo.ai",
    "HelpDesk AI",
    "Next.js developer portfolio",
    "AI product engineer Surat",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: "The Weekend Builder — Bhadreshkumar Malankiya",
    description:
      "A life in code, ownership, and the habit of starting again. Portfolio & memoir of a Senior Full Stack Engineer and Technical Lead.",
    type: "website",
    url: siteUrl,
    siteName: "The Weekend Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Weekend Builder — Bhadreshkumar Malankiya",
    description: "Sole owner of two live SaaS products. Eight years of shipping, told honestly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="relative overflow-x-clip">
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
            address: { "@type": "PostalAddress", addressLocality: profile.location },
            worksFor: { "@type": "Organization", name: "ExpressTech Systems" },
            knowsAbout: [
              "Full Stack Development",
              "Next.js",
              "React",
              "Node.js",
              "AI Integrations",
              "Software Architecture",
              "Data Visualization",
            ],
            sameAs: [],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "The Weekend Builder",
            url: siteUrl,
            description: profile.summary,
            author: { "@type": "Person", name: profile.name },
          }}
        />
        <div className="grain" aria-hidden="true" />
        <SmoothScroll>
          <Nav />
          <main className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
        <FloatingContactCard />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
