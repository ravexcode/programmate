import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggestions",
  description:
    "Have an idea for NexZero? Send your suggestion and help shape the roadmap of the project management suite for developers.",
  alternates: {
    canonical: "/support/suggestions",
  },
};

export default function SuggestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
