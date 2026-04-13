import { getPriceDisplay } from "@/lib/price";

interface PriceDisplayProps {
  priceUsd: number;
  adet: number;
  exchangeRate: number;
}

export default function PriceDisplay({
  priceUsd,
  adet,
  exchangeRate,
}: PriceDisplayProps) {
  const price = getPriceDisplay(priceUsd, adet, exchangeRate);

  return (
    <div className="space-y-1">
      <p className="font-semibold" style={{ color: "#488602" }}>
        KDV Haric Adet Fiyati: {price.unitPriceExKdvFormatted}
      </p>
      <p style={{ color: "#488602" }}>
        KDV Haric Toplam Fiyati: {price.totalPriceExKdvFormatted}
      </p>
      <p className="font-semibold text-base" style={{ color: "#cc0636" }}>
        KDV Dahil Toplam Fiyati: {price.totalPriceIncKdvFormatted}
      </p>
    </div>
  );
}
