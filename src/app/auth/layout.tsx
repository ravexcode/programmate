import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prismaflow - Authentification"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}