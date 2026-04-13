import { prisma } from "./db";

const TCMB_URL =
  "https://www.tcmb.gov.tr/kurlar/today.xml";
const CACHE_KEY = "exchange_rate_usd_try";
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function getUsdTryRate(): Promise<number> {
  // Check cache
  const cached = await prisma.setting.findUnique({ where: { key: CACHE_KEY } });
  if (cached) {
    const data = JSON.parse(cached.value);
    const age = Date.now() - data.fetchedAt;
    if (age < CACHE_DURATION_MS) {
      return data.rate;
    }
  }

  // Fetch fresh rate from TCMB
  try {
    const res = await fetch(TCMB_URL, { next: { revalidate: 21600 } });
    const xml = await res.text();

    // Parse USD selling rate from XML
    const usdMatch = xml.match(
      /<Currency[^>]*CurrencyCode="USD"[^>]*>[\s\S]*?<ForexSelling>([\d.,]+)<\/ForexSelling>/
    );
    if (!usdMatch) throw new Error("USD rate not found in TCMB XML");

    const rate = parseFloat(usdMatch[1].replace(",", "."));

    // Cache in DB
    await prisma.setting.upsert({
      where: { key: CACHE_KEY },
      update: { value: JSON.stringify({ rate, fetchedAt: Date.now() }) },
      create: { key: CACHE_KEY, value: JSON.stringify({ rate, fetchedAt: Date.now() }) },
    });

    return rate;
  } catch {
    // Fallback to cached value even if stale
    if (cached) {
      return JSON.parse(cached.value).rate;
    }
    // Hardcoded fallback
    return 38.5;
  }
}
