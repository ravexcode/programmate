import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the NexZero privacy policy: what data we collect, how we use it and how we keep your information safe.",
  alternates: {
    canonical: "/legal/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
