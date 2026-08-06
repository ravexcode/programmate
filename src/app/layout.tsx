import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";
import "./config.css";
import "./fonts.css";

//Vercel deploy requirements
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nex0.ravexcode.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NexZero — Project management suite for developers",
    template: "%s | NexZero",
  },
  description:
    "NexZero is the project management suite built by developers, for developers. Projects, tickets, kanban boards, calendars, database diagrams and AI-powered workflows in one workspace.",
  keywords: [
    "NexZero",
    "project management",
    "developer tools",
    "kanban board",
    "issue tracking",
    "database diagram",
    "ERD",
    "AI workflows",
    "agile",
    "open source",
  ],
  applicationName: "NexZero",
  authors: [{ name: "NexZero", url: siteUrl }],
  creator: "NexZero",
  publisher: "NexZero",
  category: "Project management",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "NexZero",
    title: "NexZero — Project management suite for developers",
    description:
      "Projects, tickets, kanban boards, calendars, database diagrams and AI-powered workflows in one workspace. Built by developers, for developers.",
    locale: "en_US",
    images: [
      {
        url: "/images/dashboard.webp",
        width: 1200,
        height: 630,
        alt: "NexZero dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexZero — Project management suite for developers",
    description:
      "Projects, tickets, kanban boards, calendars, database diagrams and AI-powered workflows in one workspace.",
    images: ["/images/dashboard.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logos/logo.svg",
    shortcut: "/logos/logo.svg",
    apple: "/logos/logo.svg",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    data-scroll-behavior="smooth">
      <link rel="shortcut icon" href="/logos/logo.svg" type="image/x-icon" />
      <body className="bg-black text-zinc-50 font-open-sans">
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
