import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexZero - Product"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}