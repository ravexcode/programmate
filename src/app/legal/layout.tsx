import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  description: "NexZero legal documents: privacy policy and terms of service."
};

export default function LegalLayout({
  children
}  : {
  children: React.ReactNode
}){
  return children
}