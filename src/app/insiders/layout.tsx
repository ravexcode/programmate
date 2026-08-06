import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insiders",
  description:
    "Join the NexZero insiders program. Get early access to new features, roadmap updates and behind-the-scenes of how we build the project management suite for developers.",
  alternates: {
    canonical: "/insiders",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}