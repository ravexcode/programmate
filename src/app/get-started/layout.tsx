import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Create your first project in NexZero and start tracking tickets, boards and workflows in minutes.",
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