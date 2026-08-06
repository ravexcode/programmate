import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore NexZero: dashboards, tickets, kanban boards, database diagrams, calendars and AI-powered workflows designed for development teams.",
  alternates: {
    canonical: "/product",
  },
  openGraph: {
    title: "Product | NexZero",
    description:
      "Dashboards, tickets, kanban boards, database diagrams, calendars and AI workflows in one workspace.",
    images: ["/images/dashboard.webp"],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}