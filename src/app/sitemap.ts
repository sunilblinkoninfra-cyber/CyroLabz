import { MetadataRoute } from "next";
import { SERVICES_DATA } from "@/data/servicesData";
import { CASE_STUDIES } from "@/data/workData";
import { INSIGHTS_DATA } from "@/data/insightsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cyrolabz.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/audits`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = Object.keys(SERVICES_DATA).map(
    (slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: now,
      priority: 0.85,
    })
  );

  const workRoutes: MetadataRoute.Sitemap = Object.keys(CASE_STUDIES).map(
    (slug) => ({
      url: `${baseUrl}/work/${slug}`,
      lastModified: now,
      priority: 0.8,
    })
  );

  const insightRoutes: MetadataRoute.Sitemap = Object.keys(INSIGHTS_DATA).map(
    (slug) => ({
      url: `${baseUrl}/insights/${slug}`,
      lastModified: now,
      priority: 0.75,
    })
  );

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...insightRoutes];
}
