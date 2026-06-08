import { Metadata } from "next";

const metadata: Metadata ={
  title: "Prismaflow - Project settings"
}

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode
}){
  return children;
}