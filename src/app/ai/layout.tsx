import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents chat",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
