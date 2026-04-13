"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVariantLabels,
  getDistinctOptions,
  getAvailableOptionsForSelection,
  getCompatibleVariants,
  type VariantOption,
} from "@/lib/variants";

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
    `px-3 py-1.5 rounded-md text-sm cursor-pointer border-2 transition-all select-none ${
      isSelected
        ? "border-[#cc0636] shadow-[0_0_0_1.5px_#cc0636]"
        : "border-gray-200"
    } ${
      isAvailable
        ? "hover:border-gray-400"
        : "opacity-40 cursor-not-allowed"
    }`;

  return (
    <div className="space-y-3">
      {baskiOptions.length > 0 && (
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-700 mb-2">
            {labels.baski}
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
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-700 mb-2">
            {labels.desen}
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
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-700 mb-2">
            {labels.renk}
          </h4>
          <div className="flex flex-wrap gap-2">
            {renkOptions.map((opt) => {
              const isAvail = available.availableRenk.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!isAvail}
                  className={optionBoxClass(selected.renk === opt, isAvail)}
                  onClick={() => isAvail && handleSelect("renk", opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {adetOptions.length > 0 && (
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-700 mb-2">
            {labels.adet}
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
