import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexZero - Your profile"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}