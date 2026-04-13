const KDV_RATE = 0.20;

export function convertToTry(usd: number, exchangeRate: number): number {
  return usd * exchangeRate;
}

export function calculateKdv(price: number): number {
  return price * KDV_RATE;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getPriceDisplay(
  priceUsd: number,
  adet: number,
  exchangeRate: number
) {
  const unitPriceTry = convertToTry(priceUsd, exchangeRate);
  const totalPriceTry = unitPriceTry * adet;
  const totalWithKdv = totalPriceTry + calculateKdv(totalPriceTry);

  return {
    unitPriceExKdv: unitPriceTry,
    totalPriceExKdv: totalPriceTry,
    totalPriceIncKdv: totalWithKdv,
    unitPriceExKdvFormatted: formatPrice(unitPriceTry),
    totalPriceExKdvFormatted: formatPrice(totalPriceTry),
    totalPriceIncKdvFormatted: formatPrice(totalWithKdv),
  };
}
