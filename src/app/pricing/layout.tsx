import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexZero - Pricing"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}