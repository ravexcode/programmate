import { Metadata } from "next";

const metadata: Metadata ={
  title: "NexZero - Project settings"
}

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode
}){
  return children;
}