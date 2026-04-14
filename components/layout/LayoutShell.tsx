"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import ScrollToTop from "./ScrollToTop";
import { type ReactNode } from "react";
import { type CategoryTreeItem } from "./CategoryBar";

interface Props {
  children: ReactNode;
  categoryTree?: CategoryTreeItem[];
}

export default function LayoutShell({ children, categoryTree }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header categoryTree={categoryTree} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
