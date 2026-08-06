import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Bug",
  description:
    "Found a bug in NexZero? Report it here and help us make the project management suite for developers better.",
  alternates: {
    canonical: "/support/bugs",
  },
};

export default function BugsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
