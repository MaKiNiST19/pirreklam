import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page
    .findUnique({ where: { slug: "kurumsal" } })
    .catch(() => null);

  return {
    title: page?.seoTitle || "Kurumsal - Pir Reklam",
    description:
      page?.seoDescription || "Pir Reklam kurumsal bilgileri.",
    alternates: { canonical: "/kurumsal/" },
  };
}

export default async function CorporatePage() {
  const page = await prisma.page
    .findUnique({ where: { slug: "kurumsal", isPublished: true } })
    .catch(() => null);

  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {page.title}
      </h1>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
