import { useCart } from '@/src/context/cart-context';
import { ProductShop } from '@/src/types/product';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useAddToCart } from '@/src/lib/api/carts';
import { useMe } from '@/src/lib/api/auth';

interface ProductCardProps {
    productItem: ProductShop;
}

export function ProductCard({ productItem }: ProductCardProps) {
    // console.log(productItem)
    // const { addItem } = useCart();
    const { data: user } = useMe();
    const { mutate: addToCart } = useAddToCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // addToCart({
        //   user_id: user?.id,
        //   product_id: productItems.id,
        //   item_qty: 1,
        // });
        toast.success(`${productItem.product.name} added to cart`);
    };

    return (
        <Link href={`/products/${productItem.product.id}`} className="group block">
            <article className="product-card-hover rounded-lg border border-border bg-card overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                    {productItem.product.images.length > 0 && (
                        <img
                            src={productItem.product.images[0].image_url}
                            alt={productItem.product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-sm font-medium text-card-foreground mb-2 line-clamp-1">
                        {productItem.product.name}
                    </h3>
                    <h3 className="text-sm font-medium text-card-foreground mb-2 line-clamp-1">
                        {productItem.product.user.fullname}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            }).format(productItem.price || 0)}
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
