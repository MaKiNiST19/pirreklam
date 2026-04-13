import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/layout/SearchBar";
import MegaMenu from "@/components/layout/MegaMenu";
import MobileNav from "@/components/layout/MobileNav";
import CartButton from "@/components/layout/CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-border">
        <div className="max-w-[1200px] mx-auto flex items-center justify-end px-4 py-1">
          <a
            href="tel:4441030"
            className="text-sm text-secondary italic font-semibold"
          >
            444 10 30
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-gray-border">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-2 relative">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Pir Reklam"
                width={200}
                height={88}
                className="h-[88px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* Center: search */}
          <SearchBar />

          {/* Right: cart */}
          <CartButton />
        </div>
      </div>

      {/* Mega menu (desktop) */}
      <MegaMenu />
    </header>
  );
}
