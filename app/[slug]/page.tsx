import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

// Reserved slugs handled by other routes
const RESERVED_SLUGS = [
  "urun",
  "urun-kategori",
  "sepet",
  "iletisim",
  "kurumsal",
  "banka-hesaplari",
  "arama",
  "api",
  "admin",
];

export async function generateStaticParams() {
  const pages = await prisma.page
    .findMany({
      where: { isPublished: true },
      select: { slug: true },
    })
    .catch(() => []);

  return pages
    .filter((p: { slug: string }) => !RESERVED_SLUGS.includes(p.slug) && p.slug !== "kurumsal")
    .map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) return {};

  const page = await prisma.page
    .findUnique({ where: { slug } })
    .catch(() => null);

  if (!page) return { title: "Sayfa Bulunamadi" };

  return {
    title: page.seoTitle || `${page.title} - Pir Reklam`,
    description: page.seoDescription || "",
    alternates: { canonical: `/${slug}/` },
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) notFound();

  const page = await prisma.page
    .findUnique({ where: { slug, isPublished: true } })
    .catch(() => null);

  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {page.title}
      </h1>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />
    </div>
  );
}
