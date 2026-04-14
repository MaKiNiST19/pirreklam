"use client";

import { useState, useCallback } from "react";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import VariantSelector from "@/components/product/VariantSelector";
import PriceDisplay from "@/components/product/PriceDisplay";
import WhatsAppButton from "@/components/product/WhatsAppButton";
import VariantSummaryModal from "@/components/product/VariantSummaryModal";
import type { VariantOption } from "@/lib/variants";
import type { BankAccount } from "@/types/index";

interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
    productType: string | null;
  };
  variants: VariantOption[];
  exchangeRate: number;
  bankAccounts: BankAccount[];
}

export default function ProductDetailClient({
  product,
  variants,
  exchangeRate,
  bankAccounts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleVariantChange = useCallback(
    (variant: VariantOption | null) => {
      setSelectedVariant(variant);
    },
    []
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const item: CartItem = {
      productId: Number(product.id) || 0,
      variantId: Number(selectedVariant.id) || 0,
      sku: selectedVariant.sku,
      title: product.title,
      image: product.images[0] || "/placeholder.png",
      baskiOption: selectedVariant.baskiOption || undefined,
      renkOption: selectedVariant.renkOption || undefined,
      desenOption: selectedVariant.desenOption || undefined,
      adet: selectedVariant.adet,
      priceUsd: selectedVariant.priceUsd,
      quantity: 1,
    };

    addToCart(item);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <VariantSelector
        variants={variants}
        productType={product.productType}
        exchangeRate={exchangeRate}
        onVariantChange={handleVariantChange}
      />

      {selectedVariant && (
        <PriceDisplay
          priceUsd={selectedVariant.priceUsd}
          adet={selectedVariant.adet}
          exchangeRate={exchangeRate}
        />
      )}

      {/* Sepete Ekle + WhatsApp yan yana */}
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#cc0636" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Sepete Ekle
        </button>

        <WhatsAppButton
          product={{ title: product.title, slug: product.slug }}
          variant={
            selectedVariant
              ? {
                  baskiOption: selectedVariant.baskiOption,
                  renkOption: selectedVariant.renkOption,
                  desenOption: selectedVariant.desenOption,
                  adet: selectedVariant.adet,
                  sku: selectedVariant.sku,
                }
              : {}
          }
        />
      </div>

      {selectedVariant && (
        <VariantSummaryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={{ id: product.id, title: product.title, slug: product.slug, image: product.images[0] }}
          selectedVariant={selectedVariant}
          exchangeRate={exchangeRate}
          bankAccounts={bankAccounts}
        />
      )}
    </div>
  );
}
