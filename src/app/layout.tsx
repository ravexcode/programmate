import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";
import "./config.css";
import "./fonts.css";

//Vercel deploy requirements
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "NexZero",
  description: "The aplication from programmers to programmers"
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
