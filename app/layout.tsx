import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import LayoutShell from "@/components/layout/LayoutShell";
import { prisma } from "@/lib/db";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pirreklam.com.tr"),
  title:
    "Pir Reklam – 444 10 30 | Ruhsat Kabı | Pasaport Kılıfı | Vesikalık Kabı",
  description:
    "Pir Reklam | Kurumsal Promosyon Ürünleri ve Reklam Promosyonları",
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
};

async function getCategoryTree() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { menuOrder: "asc" },
    });

    type CatNode = { id: string; name: string; slug: string; parentId: string | null; menuOrder: number; children: CatNode[] };
    const map = new Map<string, CatNode>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.forEach((c: any) => map.set(c.id, { id: c.id, name: c.name, slug: c.slug, parentId: c.parentId, menuOrder: c.menuOrder, children: [] }));

    const roots: CatNode[] = [];
    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else if (!node.parentId) {
        roots.push(node);
      }
    });

    roots.sort((a, b) => a.menuOrder - b.menuOrder);
    roots.forEach((r) => r.children.sort((a, b) => a.menuOrder - b.menuOrder));

    return roots.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      children: r.children.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    }));
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryTree = await getCategoryTree();

  return (
    <html lang="tr" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <LayoutShell categoryTree={categoryTree}>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
