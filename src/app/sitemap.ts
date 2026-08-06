import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nex0.ravexcode.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketingRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/product`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/insiders`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/support/bugs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/support/suggestions`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/legal/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/legal/tos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...marketingRoutes, ...legalRoutes];
}
