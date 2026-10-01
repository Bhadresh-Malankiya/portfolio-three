import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./portfolio.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { identity } from "@/data/portfolio";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT", "WONK"], weight: "variable", style: ["normal", "italic"], display: "swap" });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const siteUrl = `https://${identity.site}`;
const title = "Bhadresh Malankiya — Senior Full-Stack & AI Engineer";
const description = "Senior full-stack and AI engineer with 8+ years of experience. Explore React, Next.js, TypeScript, Node.js, production SaaS and voice AI projects, technical contributions and case studies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Bhadresh Malankiya" },
  description,
  keywords: ["Bhadresh Malankiya", "Senior Full-Stack Engineer", "AI Engineer", "TypeScript", "React", "Next.js", "Node.js", "SaaS", "Backend Architecture", "RAG", "Voice AI", "VocalXI", "Technical Lead"],
  authors: [{ name: identity.name, url: siteUrl }], creator: identity.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title, description, type: "website", url: siteUrl, siteName: "Bhadresh Malankiya / Engineering portfolio" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}><body className="relative overflow-x-clip"><a className="pf-skip" href="#main-content">Skip to main content</a><JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: identity.name, jobTitle: identity.role, description: identity.summary, url: siteUrl, email: `mailto:${identity.email}`, knowsAbout: ["TypeScript", "React", "Next.js", "Node.js", "Software Architecture", "SaaS", "Applied AI", "Voice AI"] }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Bhadresh Malankiya / Engineering portfolio", url: siteUrl, description, author: { "@type": "Person", name: identity.name } }} /><Nav /><main id="main-content" tabIndex={-1} className="relative z-10">{children}</main><Footer /><Analytics /><SpeedInsights /></body></html>;
}
