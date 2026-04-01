import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/modules-sap`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/modules-sap/fi`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/modules-sap/co`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/modules-sap/mm`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/modules-sap/sd`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/modules-sap/hcm`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/modules-sap/pp`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/certifications`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/fi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/co`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/mm`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/sd`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/hcm`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/certifications/pp`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/s4hana`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/processus-metier`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/ai-joule`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  return staticRoutes;
}
