export type ProductType =
  | "mat_biala"
  | "termo_deri"
  | "lux_suni_deri"
  | null;

export interface VariantLabels {
  baski: string;
  renk: string;
  desen?: string;
  adet: string;
}

export function getVariantLabels(productType: string | null): VariantLabels {
  const base = { baski: "BASKI SEÇENEKLERİ", adet: "TOPLAM ADET" };

  switch (productType) {
    case "mat_biala":
      return { ...base, renk: "MAT BİALA RENKLER" };
    case "termo_deri":
      return {
        ...base,
        desen: "TERMO DERİ DESENLER",
        renk: "TERMO DERİ RENKLER",
      };
    case "lux_suni_deri":
      return {
        ...base,
        desen: "LÜX SUNİ DERİ DESENLER",
        renk: "LÜX SUNİ DERİ RENKLER",
      };
    default:
      return { ...base, renk: "RENKLER" };
  }
}

export interface VariantOption {
  id: string;
  sku: string;
  baskiOption: string | null;
  renkOption: string | null;
  desenOption: string | null;
  adet: number;
  priceUsd: number;
  isCompatible: boolean;
  stockCode: string | null;
}

export function getDistinctOptions(variants: VariantOption[]) {
  const compatible = variants.filter((v) => v.isCompatible);

  const baskiOptions = [...new Set(compatible.map((v) => v.baskiOption).filter(Boolean))] as string[];
  const renkOptions = [...new Set(compatible.map((v) => v.renkOption).filter(Boolean))] as string[];
  const desenOptions = [...new Set(compatible.map((v) => v.desenOption).filter(Boolean))] as string[];
  const adetOptions = [...new Set(compatible.map((v) => v.adet))].sort((a, b) => a - b);

  return { baskiOptions, renkOptions, desenOptions, adetOptions };
}

export function getCompatibleVariants(
  variants: VariantOption[],
  selected: {
    baski?: string;
    renk?: string;
    desen?: string;
    adet?: number;
  }
): VariantOption[] {
  return variants.filter((v) => {
    if (selected.baski && v.baskiOption !== selected.baski) return false;
    if (selected.renk && v.renkOption !== selected.renk) return false;
    if (selected.desen && v.desenOption !== selected.desen) return false;
    if (selected.adet && v.adet !== selected.adet) return false;
    return true;
  });
}

export function getAvailableOptionsForSelection(
  variants: VariantOption[],
  selected: {
    baski?: string;
    renk?: string;
    desen?: string;
    adet?: number;
  }
) {
  // For each option type, show what's available given other selections
  const withBaski = variants.filter(
    (v) =>
      v.isCompatible &&
      (!selected.renk || v.renkOption === selected.renk) &&
      (!selected.desen || v.desenOption === selected.desen) &&
      (!selected.adet || v.adet === selected.adet)
  );
  const withRenk = variants.filter(
    (v) =>
      v.isCompatible &&
      (!selected.baski || v.baskiOption === selected.baski) &&
      (!selected.desen || v.desenOption === selected.desen) &&
      (!selected.adet || v.adet === selected.adet)
  );
  const withDesen = variants.filter(
    (v) =>
      v.isCompatible &&
      (!selected.baski || v.baskiOption === selected.baski) &&
      (!selected.renk || v.renkOption === selected.renk) &&
      (!selected.adet || v.adet === selected.adet)
  );
  const withAdet = variants.filter(
    (v) =>
      v.isCompatible &&
      (!selected.baski || v.baskiOption === selected.baski) &&
      (!selected.renk || v.renkOption === selected.renk) &&
      (!selected.desen || v.desenOption === selected.desen)
  );

  return {
    availableBaski: [...new Set(withBaski.map((v) => v.baskiOption).filter(Boolean))] as string[],
    availableRenk: [...new Set(withRenk.map((v) => v.renkOption).filter(Boolean))] as string[],
    availableDesen: [...new Set(withDesen.map((v) => v.desenOption).filter(Boolean))] as string[],
    availableAdet: [...new Set(withAdet.map((v) => v.adet))].sort((a, b) => a - b),
  };
}

export function buildWhatsAppMessage(
  product: { title: string; slug: string },
  variant: {
    baskiOption?: string | null;
    renkOption?: string | null;
    desenOption?: string | null;
    adet?: number;
    sku?: string;
  },
  priceSummary?: string
): string {
  const lines = [
    `Merhaba, aşağıdaki ürün hakkında sipariş vermek istiyorum:`,
    ``,
    `Ürün: ${product.title}`,
    `Link: https://pirreklam.com.tr/urun/${product.slug}/`,
  ];

  if (variant.sku) lines.push(`Stok Kodu: ${variant.sku}`);
  if (variant.baskiOption) lines.push(`Baskı: ${variant.baskiOption}`);
  if (variant.renkOption) lines.push(`Renk: ${variant.renkOption}`);
  if (variant.desenOption) lines.push(`Desen: ${variant.desenOption}`);
  if (variant.adet) lines.push(`Adet: ${variant.adet}`);
  if (priceSummary) lines.push(`Fiyat: ${priceSummary}`);

  return encodeURIComponent(lines.join("\n"));
}
