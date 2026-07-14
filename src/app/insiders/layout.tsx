import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexZero - Insiders"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}