"use client";

import { useState, useCallback } from "react";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import VariantSelector from "@/components/product/VariantSelector";
import PriceDisplay from "@/components/product/PriceDisplay";
import WhatsAppButton from "@/components/product/WhatsAppButton";
import VariantSummaryModal from "@/components/product/VariantSummaryModal";
import ProductGallery from "@/components/product/ProductGallery";
import OrderNotice from "@/components/product/OrderNotice";
import ProductAccordion from "@/components/product/ProductAccordion";
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
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sepetHover, setSepetHover] = useState(false);

  const handleVariantChange = useCallback((variant: VariantOption | null) => {
    setSelectedVariant(variant);
  }, []);

  // Gallery rules:
  //  • Selected variant has its OWN image → show ONLY that image (no base, no other variants)
  //  • No variant selected → show product base images (filtered: any image that belongs to a
  //    specific variant is excluded so we don't reveal other-variant photos)
  const variantImagesSet = new Set(
    variants.map((v) => v.image).filter((img): img is string => !!img)
  );
  const baseImages = product.images.filter((img) => !variantImagesSet.has(img));

  const displayImages = selectedVariant?.image
    ? [selectedVariant.image]
    : baseImages.length > 0
      ? baseImages
      : product.images;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const item: CartItem = {
      productId: Number(product.id) || 0,
      variantId: Number(selectedVariant.id) || 0,
      sku: selectedVariant.sku,
      title: product.title,
      image: displayImages[0] || "/placeholder.png",
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

  const displayedSku = selectedVariant?.sku || variants[0]?.sku;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Left: Gallery — updates when variant changes */}
      <ProductGallery images={displayImages} title={product.title} />

      {/* Right: Title + SKU + Variants + Price + Actions */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
            {product.title}
          </h1>
          {displayedSku && (
            <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded px-2.5 py-1">
              <span className="text-[11px] font-semibold text-gray-600">Stok Kodu :</span>
              <span className="text-xs font-bold text-[#cc0636]">{displayedSku}</span>
            </div>
          )}
        </div>

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
            onMouseEnter={() => setSepetHover(true)}
            onMouseLeave={() => setSepetHover(false)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#cc0636] hover:bg-[#a80530] active:bg-[#8a0426] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#cc0636]"
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

        {/* Curved dashed arrow pointing from Sepete Ekle button down to the OrderNotice */}
        <div
          className={`relative h-6 -mt-3 -mb-3 pointer-events-none transition-opacity duration-200 ${sepetHover ? "opacity-100" : "opacity-30"}`}
          aria-hidden
        >
          <svg
            viewBox="0 0 90 30"
            className="absolute"
            style={{ left: "10%", width: "70px", height: "30px", overflow: "visible" }}
            fill="none"
          >
            <path
              d="M 8 0 C 8 18, 30 22, 60 24"
              stroke="#cc0636"
              strokeWidth="1.6"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <path
              d="M 60 24 L 53 20 M 60 24 L 55 30"
              stroke="#cc0636"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Pre-add-to-cart notice */}
        <OrderNotice />

        {/* Accordion: Baskı açıklaması, sipariş detayları, video, yorumlar — compact, inline under notice */}
        <div className="mt-2">
          <ProductAccordion />
        </div>

        {selectedVariant && (
          <VariantSummaryModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            product={{ id: product.id, title: product.title, slug: product.slug, image: displayImages[0] }}
            selectedVariant={selectedVariant}
            exchangeRate={exchangeRate}
            bankAccounts={bankAccounts}
          />
        )}
      </div>
    </div>
  );
}
