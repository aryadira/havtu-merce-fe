import { useCart } from "@/src/context/cart-context";
import { Product } from "@/src/types/product";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <article className="product-card-hover rounded-lg border border-border bg-card overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-card-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 btn-bounce"
              onClick={handleAddToCart}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
