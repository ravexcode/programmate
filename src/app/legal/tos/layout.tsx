import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the NexZero terms of service: the rules, rights and responsibilities that apply when you use NexZero.",
  alternates: {
    canonical: "/legal/tos",
  },
};

export default function TOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
