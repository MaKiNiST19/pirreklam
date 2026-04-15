export interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  menuOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  children: CategoryWithChildren[];
}

export interface ProductWithVariants {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  images: string[];
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parent?: { name: string; slug: string } | null;
  } | null;
  menuOrder: number;
  productType: string | null;
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  variants: ProductVariantData[];
}

export interface ProductVariantData {
  id: string;
  sku: string;
  baskiOption: string | null;
  renkOption: string | null;
  desenOption: string | null;
  adet: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceUsd: any;
  isCompatible: boolean;
  stockCode: string | null;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  image: string;
  baskiOption: string | null;
  renkOption: string | null;
  desenOption: string | null;
  adet: number;
  priceUsd: number;
  quantity: number;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
  currency: string;
}

export interface CompanyInfoData {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  bankAccounts: BankAccount[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
  /** When true, render as plain text instead of a link */
  noLink?: boolean;
}
