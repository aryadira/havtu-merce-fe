import { useCart } from '@/src/context/cart-context';
import { ProductShop } from '@/src/types/product';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useAddToCart } from '@/src/lib/hooks/cart';
import { useMe } from '@/src/lib/hooks/auth';
import { formatPrice } from '@/src/lib/utils';

interface ProductShopProps {
    productItem: ProductShop;
}

export function ProductCard({ productItem }: ProductShopProps) {
    const { data: user } = useMe();
    const { mutate: addToCart } = useAddToCart();

    const { id, name, image_url, price, shop_name, shop_city } = productItem;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            user_id: user?.id,
            product_id: productItem.id,
            item_qty: 1,
        });

        toast.success(`${name} added to cart`);
    };

    return (
        <Link href={`/products/${id}`} className="group block">
            <article className="product-card-hover  border border-border bg-card overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                    <img
                        src={image_url || '/images/no-image.png'}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-medium text-card-foreground line-clamp-1">{name}</h3>
                    <div className="flex flex-col justify-between gap-1">
                        <p className="text-sm text-card-foreground line-clamp-1">{shop_name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{shop_city}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                            {formatPrice(price || 0)}
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
