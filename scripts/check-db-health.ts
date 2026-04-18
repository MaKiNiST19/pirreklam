/**
 * Quick post-sync DB health check (read-only).
 * Run: npx tsx scripts/check-db-health.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [products, variants, cats] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.category.count(),
  ]);

  const zeroVar = await prisma.product.findMany({
    where: { variants: { none: {} } },
    select: { slug: true, title: true },
  });

  const noCategory = await prisma.product.findMany({
    where: { categoryId: null },
    select: { slug: true, title: true },
  });

  const noImages = await prisma.product.findMany({
    where: { images: { isEmpty: true } },
    select: { slug: true, title: true },
  });

  console.log("📊 DB HEALTH");
  console.log("============");
  console.log(`Products:   ${products}`);
  console.log(`Variants:   ${variants}`);
  console.log(`Categories: ${cats}`);
  console.log("");
  console.log(`Products with 0 variants: ${zeroVar.length}`);
  zeroVar.forEach((p) => console.log(`  - ${p.slug}  |  ${p.title}`));
  console.log("");
  console.log(`Products with NO category:  ${noCategory.length}`);
  noCategory.forEach((p) => console.log(`  - ${p.slug}  |  ${p.title}`));
  console.log("");
  console.log(`Products with NO images:    ${noImages.length}`);
  noImages.forEach((p) => console.log(`  - ${p.slug}  |  ${p.title}`));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
