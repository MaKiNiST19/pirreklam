"use client";

import { useState } from "react";
import Image from "next/image";
import { getPriceDisplay } from "@/lib/price";
import type { BankAccount } from "@/types/index";
import type { VariantOption } from "@/lib/variants";
import WhatsAppButton from "./WhatsAppButton";

interface VariantSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; title: string; slug: string; image?: string };
  selectedVariant: VariantOption;
  exchangeRate: number;
  bankAccounts: BankAccount[];
  onMemberLogin?: () => void;
  onContinueAsGuest?: () => void;
}

export default function VariantSummaryModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  exchangeRate,
  bankAccounts,
  onMemberLogin,
  onContinueAsGuest,
}: VariantSummaryModalProps) {
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [showBanks, setShowBanks] = useState(false);

  if (!isOpen) return null;

  const price = getPriceDisplay(selectedVariant.priceUsd, selectedVariant.adet, exchangeRate);
  const priceSummary = `KDV Dahil: ${price.totalPriceIncKdvFormatted}`;

  const copyIban = async (iban: string) => {
    await navigator.clipboard.writeText(iban);
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-100">
          {product.image && (
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image src={product.image} alt={product.title} fill className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 leading-tight pr-6">{product.title}</h2>
            <div className="mt-1 space-y-0.5 text-xs text-gray-600">
              {selectedVariant.baskiOption && <p><span className="font-semibold">Baskı:</span> {selectedVariant.baskiOption}</p>}
              {selectedVariant.renkOption && <p><span className="font-semibold">Renk:</span> {selectedVariant.renkOption}</p>}
              {selectedVariant.desenOption && <p><span className="font-semibold">Desen:</span> {selectedVariant.desenOption}</p>}
              <p><span className="font-semibold">Adet:</span> {selectedVariant.adet.toLocaleString("tr-TR")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Price summary */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">KDV Hariç Adet Fiyatı</span>
            <span className="font-semibold" style={{ color: "#488602" }}>{price.unitPriceExKdvFormatted}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">KDV Hariç Toplam</span>
            <span className="font-semibold" style={{ color: "#488602" }}>{price.totalPriceExKdvFormatted}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-gray-800">KDV Dahil Toplam</span>
            <span style={{ color: "#cc0636" }}>{price.totalPriceIncKdvFormatted}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-500 text-center mb-1">Siparişinizi nasıl vermek istersiniz?</p>

          <button
            type="button"
            onClick={onMemberLogin}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-colors"
            style={{ backgroundColor: "#25497f" }}
          >
            Üye Ol / Giriş Yap
          </button>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Üye Olmadan Devam Et
          </button>

          {/* WhatsApp */}
          <div className="pt-1">
            <WhatsAppButton product={product} variant={selectedVariant} priceSummary={priceSummary} />
          </div>

          {/* Bank accounts toggle */}
          {bankAccounts.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowBanks((s) => !s)}
                className="w-full text-sm text-[#25497f] font-medium hover:underline"
              >
                {showBanks ? "Banka Hesaplarını Gizle ▲" : "Banka Hesaplarını Gör ▼"}
              </button>

              {showBanks && (
                <div className="mt-2 space-y-2">
                  {bankAccounts.map((bank) => (
                    <div key={bank.iban} className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                      <p className="font-semibold text-gray-800">{bank.bankName}</p>
                      <p className="text-gray-600 text-xs">{bank.accountHolder}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono break-all">{bank.iban}</span>
                        <button
                          type="button"
                          onClick={() => copyIban(bank.iban)}
                          className="shrink-0 text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          {copiedIban === bank.iban ? "Kopyalandı!" : "Kopyala"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
