import { useCart } from "@/src/context/cart-context";
import { ProductShop } from "@/src/types/product";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: ProductShop;
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
    <Link href={`/products/shop/${product.id}`} className="group block">
      <article className="product-card-hover rounded-lg border border-border bg-card overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-card-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>
          <h3 className="text-sm font-medium text-card-foreground mb-2 line-clamp-1">
            {product.user.fullname}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price || 0)}
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
