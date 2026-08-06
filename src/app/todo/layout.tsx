import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To Do",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}