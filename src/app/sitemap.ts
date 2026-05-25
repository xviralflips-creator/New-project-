import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const routes = [
    "",
    "/features",
    "/pricing",
    "/templates",
    "/docs",
    "/changelog",
    "/contact",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
  ];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
