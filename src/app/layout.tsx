import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Programmate",
  description: "The aplication from programmers to programmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
