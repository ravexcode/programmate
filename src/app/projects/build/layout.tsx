import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexZero - Build a new project"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}