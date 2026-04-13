import type { ProductWithVariants } from "@/types/index";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductWithVariants[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 min-[478px]:grid-cols-2 min-[768px]:grid-cols-3 gap-5 justify-items-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
