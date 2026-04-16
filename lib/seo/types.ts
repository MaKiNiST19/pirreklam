import type { ReactNode } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export interface SeoPackage {
  /** Category slug this content belongs to (L1 or L2 slug). */
  slug: string;
  /** The H1 shown above the collapsible content. */
  h1: string;
  /** Optional meta override (title + description). If absent, page metadata uses category defaults. */
  meta?: {
    title?: string;
    description?: string;
  };
  /**
   * Featured Snippet definition: 40–60 word sharp definitional answer shown in a
   * highlighted box at the top of the SEO section. Targets Google Featured Snippets
   * and AI Overview quoting. When absent, the Featured Snippet box is not rendered.
   */
  definition?: string;
  /** JSX body of the SEO article (h2/h3/p/ul/ol/strong allowed). */
  content: ReactNode;
  /** Frequently Asked Questions for schema.org FAQPage. */
  faq: FaqItem[];
  /** Optional product name/description used in Product schema injected for category. */
  product?: {
    name: string;
    description: string;
    category?: string;
    brand?: string;
  };
}
