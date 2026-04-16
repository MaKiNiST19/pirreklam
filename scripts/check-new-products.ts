import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const recent = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      title: true,
      slug: true,
      isPublished: true,
      createdAt: true,
      _count: { select: { variants: true } },
    },
  });
  console.log("\nMost recently created products:");
  recent.forEach((p, i) => {
    console.log(
      `${i + 1}. pub=${p.isPublished ? "✔" : "✗"} v=${p._count.variants}  ${p.title}`,
    );
    console.log(`   slug=${p.slug}`);
    console.log(`   url=/urun/${p.slug}/`);
  });
  await prisma.$disconnect();
}
main();
