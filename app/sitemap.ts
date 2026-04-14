import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pirreklam.com.tr";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/kurumsal/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/iletisim/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/banka-hesaplari/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Products
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const productPages: MetadataRoute.Sitemap = products.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/urun/${p.slug}/`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Categories
  const categories = await prisma.category.findMany({
    select: { slug: true, parentId: true, updatedAt: true, parent: { select: { slug: true } } },
  });
  const categoryPages: MetadataRoute.Sitemap = categories.map((c: { slug: string; parentId: string | null; updatedAt: Date; parent: { slug: string } | null }) => {
    const path = c.parent ? `${c.parent.slug}/${c.slug}` : c.slug;
    return {
      url: `${baseUrl}/urun-kategori/${path}/`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // CMS Pages
  const pages = await prisma.page.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const cmsPages: MetadataRoute.Sitemap = pages.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/${p.slug}/`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...cmsPages];
}
