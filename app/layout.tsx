import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import LayoutShell from "@/components/layout/LayoutShell";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pirreklam.com.tr"),
  title:
    "Pir Reklam – 444 10 30 | Ruhsat Kabı | Pasaport Kılıfı | Vesikalık Kabı",
  description:
    "Pir Reklam | Kurumsal Promosyon Ürünleri ve Reklam Promosyonları",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#e8e8e8]">
        <div className="max-w-[1320px] mx-auto min-h-screen flex flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.15)] overflow-x-hidden">
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
