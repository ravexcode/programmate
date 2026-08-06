import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing scaled for your team. Start free with 2 projects and upgrade to Pro or Enterprise for unlimited projects, AI models and team features.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | NexZero",
    description:
      "Start free and upgrade when your workflow grows. Free, Pro and Enterprise plans.",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}