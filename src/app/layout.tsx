import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";

export const metadata: Metadata = {
  title: "Programmate",
  description: "The aplication from programmers to programmers"
};

import { ViewTransition } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="shortcut icon" href="/logos/logo.svg" type="image/x-icon" />
      <body className="bg-black">
        <ViewTransition
        name="page">
        {children}
        </ViewTransition>
      </body>
    </html>
  );
}
