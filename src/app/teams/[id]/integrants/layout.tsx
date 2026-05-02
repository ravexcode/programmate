import type { Metadata } from "next";

export const title: Metadata = {
  title: "Prismaflow - In construction"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}