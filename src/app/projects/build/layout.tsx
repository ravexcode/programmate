import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build a new project",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}