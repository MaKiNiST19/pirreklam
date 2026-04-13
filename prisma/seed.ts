import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("PirReklam2026!", 12);
  await prisma.user.upsert({
    where: { email: "admin@pirreklam.com.tr" },
    update: {},
    create: {
      email: "admin@pirreklam.com.tr",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  // Create editor user
  const editorPassword = await bcrypt.hash("PirEditor2026!", 12);
  await prisma.user.upsert({
    where: { email: "editor@pirreklam.com.tr" },
    update: {},
    create: {
      email: "editor@pirreklam.com.tr",
      passwordHash: editorPassword,
      name: "Editör",
      role: "EDITOR",
    },
  });

  // Create company info
  await prisma.companyInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: "444 10 30",
      whatsapp: "905442338003",
      email: "info@pirreklam.com.tr",
      address: "Pir Reklam Promosyon\nİstanbul, Türkiye",
      bankAccounts: JSON.parse(JSON.stringify([
        {
          bankName: "Ziraat Bankası",
          accountHolder: "Pir Reklam",
          iban: "TR00 0000 0000 0000 0000 0000 00",
          currency: "TRY",
        },
      ])),
      socialLinks: JSON.parse(JSON.stringify({
        facebook: "https://facebook.com/pirreklampromosyon",
        instagram: "https://instagram.com/pirreklampromosyon",
        linkedin: "https://linkedin.com/company/pirreklampromosyon",
        youtube: "https://youtube.com/@pirreklampromosyon",
        twitter: "https://twitter.com/pirreklam",
      })),
    },
  });

  // Create main categories
  const plastik = await prisma.category.upsert({
    where: { slug: "plastik-urunler" },
    update: {},
    create: { name: "Plastik Ürünler", slug: "plastik-urunler", menuOrder: 1 },
  });

  const promosyon = await prisma.category.upsert({
    where: { slug: "promosyon-urunler" },
    update: {},
    create: { name: "Promosyon Ürünler", slug: "promosyon-urunler", menuOrder: 2 },
  });

  const canta = await prisma.category.upsert({
    where: { slug: "canta" },
    update: {},
    create: { name: "Çanta", slug: "canta", menuOrder: 3 },
  });

  const matbaa = await prisma.category.upsert({
    where: { slug: "matbaa-urunleri" },
    update: {},
    create: { name: "Matbaa Ürünleri", slug: "matbaa-urunleri", menuOrder: 4 },
  });

  // Plastik Ürünler sub-categories
  const plastikSubs = [
    { name: "Ruhsat Kabı", slug: "ruhsat-kabi", order: 1 },
    { name: "Pasaport Kılıfı", slug: "pasaport-kilifi", order: 2 },
    { name: "Vesikalık Kabı", slug: "vesikalik-kabi", order: 3 },
    { name: "Fotoğraf Kabı", slug: "fotograf-kabi", order: 4 },
    { name: "Döviz Kabı", slug: "doviz-kabi", order: 5 },
    { name: "Kredi Kartlık", slug: "kredi-kartlik", order: 6 },
    { name: "Veteriner Aşı Karnesi Kabı", slug: "veteriner-asi-karnesi-kabi", order: 7 },
    { name: "Evlilik Cüzdanı Kılıfı", slug: "evlilik-cuzdani-kilifi", order: 8 },
    { name: "Sayısal Loto Kabı", slug: "sayisal-loto-kabi", order: 9 },
    { name: "Uzun Yük Bayrağı", slug: "uzun-yuk-bayragi", order: 10 },
    { name: "Bagaj Valiz Etiketliği", slug: "bagaj-valiz-etiketligi", order: 11 },
    { name: "Plakalık", slug: "plakalik", order: 12 },
    { name: "Police Kabı", slug: "police-kabi", order: 13 },
  ];

  for (const sub of plastikSubs) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { name: sub.name, slug: sub.slug, parentId: plastik.id, menuOrder: sub.order },
    });
  }

  // Promosyon sub-categories
  const promosyonSubs = [
    { name: "Oto Kokusu", slug: "oto-kokusu", order: 1 },
    { name: "Kalem", slug: "kalem", order: 2 },
    { name: "Çakmak", slug: "cakmak", order: 3 },
    { name: "Anahtarlık", slug: "anahtarlik", order: 4 },
    { name: "Bardak Altlığı", slug: "bardak-altligi", order: 5 },
    { name: "Ajanda", slug: "ajanda", order: 6 },
    { name: "Defterler", slug: "defterler", order: 7 },
    { name: "Mouse Pad", slug: "mouse-pad", order: 8 },
    { name: "Duvar Saatleri", slug: "duvar-saatleri", order: 9 },
    { name: "Bozuk Para Cüzdanı", slug: "bozuk-para-cuzdani", order: 10 },
  ];

  for (const sub of promosyonSubs) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { name: sub.name, slug: sub.slug, parentId: promosyon.id, menuOrder: sub.order },
    });
  }

  // Çanta sub-categories
  const cantaSubs = [
    { name: "Promosyon Çanta", slug: "promosyon-canta", order: 1 },
    { name: "Elbise Kılıfları", slug: "elbise-kiliflari", order: 2 },
    { name: "Laptop Çantaları", slug: "laptop-cantalari", order: 3 },
    { name: "Spor ve Seyahat Çantaları", slug: "spor-ve-seyahat-cantalari", order: 4 },
  ];

  for (const sub of cantaSubs) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { name: sub.name, slug: sub.slug, parentId: canta.id, menuOrder: sub.order },
    });
  }

  // Matbaa sub-categories
  const matbaaSubs = [
    { name: "Kartvizit", slug: "kartvizit", order: 1 },
    { name: "El İlanı", slug: "el-ilani", order: 2 },
    { name: "Magnet", slug: "magnet", order: 3 },
    { name: "Sticker", slug: "sticker", order: 4 },
    { name: "Küp Blok Not", slug: "kup-blok-not", order: 5 },
    { name: "Takvimler", slug: "takvimler", order: 6 },
  ];

  for (const sub of matbaaSubs) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { name: sub.name, slug: sub.slug, parentId: matbaa.id, menuOrder: sub.order },
    });
  }

  // Create legal/static pages
  const staticPages = [
    { title: "Kurumsal", slug: "kurumsal", content: "<p>Pir Reklam kurumsal sayfası içeriği WordPress'ten aktarılacak.</p>" },
    { title: "Üyelik Sözleşmesi", slug: "uyelik-sozlesmesi", content: "<p>Üyelik sözleşmesi içeriği WordPress'ten aktarılacak.</p>" },
    { title: "Gizlilik Sözleşmesi", slug: "gizlilik-sozlesmesi", content: "<p>Gizlilik sözleşmesi içeriği WordPress'ten aktarılacak.</p>" },
    { title: "Kullanım Koşulları", slug: "kullanim-kosullari", content: "<p>Kullanım koşulları içeriği WordPress'ten aktarılacak.</p>" },
    { title: "Mesafeli Satış Sözleşmesi", slug: "mesafeli-satis-sozlesmesi", content: "<p>Mesafeli satış sözleşmesi içeriği WordPress'ten aktarılacak.</p>" },
    { title: "KVKK Aydınlatma Metni", slug: "kvkk-aydinlatma-metni", content: "<p>KVKK aydınlatma metni içeriği WordPress'ten aktarılacak.</p>" },
  ];

  for (const page of staticPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { title: page.title, slug: page.slug, content: page.content, menuOrder: 0 },
    });
  }

  // Create a sample product
  const ruhsatCategory = await prisma.category.findUnique({ where: { slug: "ruhsat-kabi" } });
  if (ruhsatCategory) {
    const product = await prisma.product.upsert({
      where: { slug: "standart-mat-biala-ruhsat-kabi" },
      update: {},
      create: {
        title: "Standart Mat Biala Ruhsat Kabı",
        slug: "standart-mat-biala-ruhsat-kabi",
        description: "<p>Standart mat biala PVC ruhsat kabı. Oto galeri, servis ve rent a car firmaları için ideal promosyon ürünü.</p>",
        images: ["https://pirreklam.com.tr/wp-content/uploads/2024/01/standart-mat-biala-ruhsat-kabi.jpg"],
        categoryId: ruhsatCategory.id,
        productType: "mat_biala",
        menuOrder: 1,
      },
    });

    // Create sample variants
    const variants = [
      { sku: "RK-MB-STD-BASKISIZ-100", baskiOption: "Baskısız", renkOption: "Şeffaf", adet: 100, priceUsd: 0.15, stockCode: "RK-001" },
      { sku: "RK-MB-STD-BASKISIZ-250", baskiOption: "Baskısız", renkOption: "Şeffaf", adet: 250, priceUsd: 0.13, stockCode: "RK-002" },
      { sku: "RK-MB-STD-BASKISIZ-500", baskiOption: "Baskısız", renkOption: "Şeffaf", adet: 500, priceUsd: 0.11, stockCode: "RK-003" },
      { sku: "RK-MB-STD-SERIGRAFI-100", baskiOption: "Serigrafi Baskı", renkOption: "Şeffaf", adet: 100, priceUsd: 0.25, stockCode: "RK-004" },
      { sku: "RK-MB-STD-SERIGRAFI-250", baskiOption: "Serigrafi Baskı", renkOption: "Şeffaf", adet: 250, priceUsd: 0.22, stockCode: "RK-005" },
      { sku: "RK-MB-STD-SERIGRAFI-500", baskiOption: "Serigrafi Baskı", renkOption: "Şeffaf", adet: 500, priceUsd: 0.19, stockCode: "RK-006" },
    ];

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          productId: product.id,
          sku: v.sku,
          baskiOption: v.baskiOption,
          renkOption: v.renkOption,
          adet: v.adet,
          priceUsd: v.priceUsd,
          stockCode: v.stockCode,
          sortOrder: i,
        },
      });
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
