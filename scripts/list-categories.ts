import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cats = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, parentId: true },
  });

  const byId = new Map(cats.map((c) => [c.id, c]));
  const roots = cats.filter((c) => !c.parentId);

  console.log("\n═══════ L1 + L2 CATEGORIES ═══════\n");

  for (const l1 of roots) {
    console.log(`L1: ${l1.name}  [slug=${l1.slug}]`);
    const l2s = cats.filter((c) => c.parentId === l1.id);
    for (const l2 of l2s) {
      console.log(`  └─ L2: ${l2.name}  [slug=${l2.slug}]`);
      const l3s = cats.filter((c) => c.parentId === l2.id);
      for (const l3 of l3s) {
        console.log(`     └─ L3: ${l3.name}  [slug=${l3.slug}]`);
      }
    }
  }

  const l1Count = roots.length;
  const l2Count = cats.filter((c) => c.parentId && byId.get(c.parentId!) && !byId.get(c.parentId!)!.parentId).length;
  console.log(`\nTotals: L1=${l1Count}, L2=${l2Count}, TOTAL L1+L2=${l1Count + l2Count}\n`);

  await prisma.$disconnect();
}

main();
