"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVariantLabels,
  getDistinctOptions,
  getAvailableOptionsForSelection,
  getCompatibleVariants,
  type VariantOption,
} from "@/lib/variants";
import { getColorCss } from "@/lib/colors";

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
    `flex items-center justify-center text-center px-2 rounded text-[12px] leading-tight font-medium cursor-pointer border transition-all select-none ${
      isSelected
        ? "border-[#cc0636] text-[#cc0636] bg-red-50"
        : "border-gray-300 text-gray-700 bg-white hover:border-gray-500"
    } ${!isAvailable ? "opacity-35 cursor-not-allowed" : ""}`;

  const fixedHeightStyle = { height: "40px", minHeight: "40px", maxHeight: "40px" } as const;

  return (
    <div className="space-y-3">
      {baskiOptions.length > 0 && (
        <div className="bg-white rounded-lg px-3 pt-2 pb-3 shadow-sm border border-gray-100">
          <h4 className="text-[11px] font-medium text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.baski}
            {selected.baski && <span className="font-medium uppercase text-[#cc0636] tracking-wide">· {selected.baski}</span>}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {baskiOptions.map((opt) => {
              const isAvail = available.availableBaski.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  style={fixedHeightStyle}
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
          <h4 className="text-[11px] font-medium text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.desen}
            {selected.desen && <span className="font-medium uppercase text-[#cc0636] tracking-wide">· {selected.desen}</span>}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {desenOptions.map((opt) => {
              const isAvail = available.availableDesen.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  style={fixedHeightStyle}
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
          <h4 className="text-[11px] font-medium text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.renk}
            {selected.renk && <span className="font-medium uppercase text-[#cc0636] tracking-wide">· {selected.renk}</span>}
          </h4>
          {/* 9 per row on mobile, 18 per row on desktop */}
          <div className="grid grid-cols-9 gap-1.5 md:[grid-template-columns:repeat(18,1fr)]">
            {renkOptions.map((opt) => {
              const isAvail = available.availableRenk.includes(opt);
              const cssColor = getColorCss(opt);
              const isSelected = selected.renk === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  title={opt}
                  disabled={!isAvail}
                  onClick={() => isAvail && handleSelect("renk", opt)}
                  className={`aspect-square w-full rounded-full transition-all select-none ${
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
          <h4 className="text-[11px] font-medium text-gray-800 uppercase tracking-wide mb-1.5 pb-1 border-b border-gray-100 flex items-center gap-1">
            {labels.adet}
            {selected.adet && <span className="font-medium uppercase text-[#cc0636] tracking-wide">· {selected.adet.toLocaleString("tr-TR")} ADET</span>}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {adetOptions.map((opt) => {
              const isAvail = available.availableAdet.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  style={fixedHeightStyle}
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
