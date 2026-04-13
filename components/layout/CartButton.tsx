"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartButton() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Link
      href="/cart/"
      className="relative flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
      aria-label="Sepet"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-accent-gold text-white rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
