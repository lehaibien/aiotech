import dayjs from "@/lib/extended-dayjs";
import { MetadataRoute } from "next";

type SiteMapItem = {
  route: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number; // between 0 and 1
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const sitemaps: SiteMapItem[] = [
    {
      route: "",
      lastModified: dayjs().toDate(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      route: "about",
      lastModified: dayjs().toDate(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      route: "products",
      lastModified: dayjs().toDate(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      route: "products/[id]",
      lastModified: dayjs().toDate(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      route: "contact",
      lastModified: dayjs().toDate(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
  return sitemaps.map((sitemap) => ({
    url: `${baseUrl}${sitemap.route}`,
    lastModified: sitemap.lastModified,
    changeFrequency: sitemap.changeFrequency,
    priority: sitemap.priority,
  }));
}
