import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to NexZero!"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}