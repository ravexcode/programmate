import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prismaflow - Legal"
};

export default function LegalLayout({
  children
}  : {
  children: React.ReactNode
}){
  return children
}