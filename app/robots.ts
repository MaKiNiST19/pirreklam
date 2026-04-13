import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/sepet/"],
      },
    ],
    sitemap: "https://pirreklam.com.tr/sitemap.xml",
  };
}
