"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVariantLabels,
  getDistinctOptions,
  getAvailableOptionsForSelection,
  getCompatibleVariants,
  type VariantOption,
} from "@/lib/variants";

const COLOR_MAP: Record<string, string> = {
  // Basic
  siyah: "#1a1a1a",
  beyaz: "#ffffff",
  kırmızı: "#e02020",
  kirmizi: "#e02020",
  mavi: "#1e6bb8",
  lacivert: "#1b2f6e",
  yeşil: "#2e7d32",
  yesil: "#2e7d32",
  sarı: "#f9c400",
  sari: "#f9c400",
  turuncu: "#f57c00",
  mor: "#7b1fa2",
  pembe: "#e91e8c",
  gri: "#9e9e9e",
  açık_gri: "#d4d4d4",
  "açık gri": "#d4d4d4",
  acik_gri: "#d4d4d4",
  "acik gri": "#d4d4d4",
  koyu_gri: "#616161",
  "koyu gri": "#616161",
  koyu: "#424242",
  kahverengi: "#6d4c41",
  kahve: "#6d4c41",
  bej: "#d7ccc8",
  krem: "#f5f0e8",
  bordo: "#880e4f",
  haki: "#8d8d3a",
  füme: "#607d8b",
  fume: "#607d8b",
  altın: "#c8960c",
  altin: "#c8960c",
  gümüş: "#bdbdbd",
  gumus: "#bdbdbd",
  bronz: "#cd7f32",
  krom: "#c0c0c0",
  şeffaf: "rgba(200,200,200,0.25)",
  seffaf: "rgba(200,200,200,0.25)",
  // Leather tones
  "siyah deri": "#1a1a1a",
  "kahve deri": "#6d4c41",
  "lacivert deri": "#1b2f6e",
  "bordo deri": "#880e4f",
};

interface VariantSelectorProps {
  variants: VariantOption[];
  productType: string | null;
  exchangeRate: number;
  onVariantChange: (variant: VariantOption | null) => void;
}

export default function VariantSelector({
  variants,
  productType,
  exchangeRate,
  onVariantChange,
}: VariantSelectorProps) {
  const labels = getVariantLabels(productType);
  const { baskiOptions, renkOptions, desenOptions, adetOptions } =
    getDistinctOptions(variants);

  const [selected, setSelected] = useState<{
    baski?: string;
    renk?: string;
    desen?: string;
    adet?: number;
  }>({});

  const available = getAvailableOptionsForSelection(variants, selected);

  const handleSelect = useCallback(
    (key: "baski" | "renk" | "desen", value: string) => {
      setSelected((prev) => ({
        ...prev,
        [key]: prev[key] === value ? undefined : value,
      }));
    },
    []
  );

  const handleAdetSelect = useCallback((value: number) => {
    setSelected((prev) => ({
      ...prev,
      adet: prev.adet === value ? undefined : value,
    }));
  }, []);

  useEffect(() => {
    const matched = getCompatibleVariants(variants, selected);
    if (matched.length === 1) {
      onVariantChange(matched[0]);
    } else {
      onVariantChange(null);
    }
  }, [selected, variants, onVariantChange]);

  const optionBoxClass = (isSelected: boolean, isAvailable: boolean) =>
    `px-2 py-0.5 rounded text-[12px] font-medium cursor-pointer border transition-all select-none ${
      isSelected
        ? "border-[#cc0636] text-[#cc0636] bg-red-50"
        : "border-gray-300 text-gray-700 bg-white hover:border-gray-500"
    } ${!isAvailable ? "opacity-35 cursor-not-allowed" : ""}`;

  return (
    <div className="space-y-3">
      {baskiOptions.length > 0 && (
        <div className="bg-white rounded-lg px-3 pt-2 pb-3 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.baski}
            {selected.baski && <span className="font-normal normal-case text-[#cc0636] tracking-normal">· {selected.baski}</span>}
          </h4>
          <div className="flex flex-wrap gap-2">
            {baskiOptions.map((opt) => {
              const isAvail = available.availableBaski.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  className={optionBoxClass(selected.baski === opt, isAvail)}
                  onClick={() => isAvail && handleSelect("baski", opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {desenOptions.length > 0 && labels.desen && (
        <div className="bg-white rounded-lg px-3 pt-2 pb-3 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.desen}
            {selected.desen && <span className="font-normal normal-case text-[#cc0636] tracking-normal">· {selected.desen}</span>}
          </h4>
          <div className="flex flex-wrap gap-2">
            {desenOptions.map((opt) => {
              const isAvail = available.availableDesen.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  className={optionBoxClass(selected.desen === opt, isAvail)}
                  onClick={() => isAvail && handleSelect("desen", opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {renkOptions.length > 0 && (
        <div className="bg-white rounded-lg px-3 pt-2 pb-3 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.renk}
            {selected.renk && <span className="font-normal normal-case text-[#cc0636] tracking-normal">· {selected.renk}</span>}
          </h4>
          <div className="flex flex-wrap gap-2">
            {renkOptions.map((opt) => {
              const isAvail = available.availableRenk.includes(opt);
              const cssColor = COLOR_MAP[opt.toLowerCase()] ?? "#cccccc";
              const isSelected = selected.renk === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  title={opt}
                  disabled={!isAvail}
                  onClick={() => isAvail && handleSelect("renk", opt)}
                  className={`w-7 h-7 rounded-sm transition-all select-none shrink-0 ${
                    isAvail ? "cursor-pointer" : "opacity-35 cursor-not-allowed"
                  } ${isSelected ? "ring-2 ring-offset-1 ring-[#cc0636]" : "ring-1 ring-gray-300"}`}
                  style={{ backgroundColor: cssColor }}
                  aria-label={opt}
                  aria-pressed={isSelected}
                />
              );
            })}
          </div>
        </div>
      )}

      {adetOptions.length > 0 && (
        <div className="bg-white rounded-lg px-3 pt-2 pb-3 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.adet}
            {selected.adet && <span className="font-normal normal-case text-[#cc0636] tracking-normal">· {selected.adet.toLocaleString("tr-TR")} Adet</span>}
          </h4>
          <div className="flex flex-wrap gap-2">
            {adetOptions.map((opt) => {
              const isAvail = available.availableAdet.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  className={optionBoxClass(selected.adet === opt, isAvail)}
                  onClick={() => isAvail && handleAdetSelect(opt)}
                >
                  {opt.toLocaleString("tr-TR")} Adet
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
