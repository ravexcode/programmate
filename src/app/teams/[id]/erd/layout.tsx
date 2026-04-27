import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prismaflow - ERD Tool"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}