"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartButton() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Link
      href="/sepet/"
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#cc0636] text-white text-[11px] font-bold hover:bg-[#a80530] transition-colors whitespace-nowrap"
      aria-label="Sepet"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <span className="hidden md:inline">0,00 ₺</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-[18px] h-[18px] text-[9px] font-bold bg-[#ffc107] text-[#25497f] rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
