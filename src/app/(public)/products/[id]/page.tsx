'use client';

import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { useCart } from '@/src/context/cart-context';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCheckout } from '@/src/lib/api/orders';
import { useProductShopDetail } from '@/src/lib/hooks/product/product-shop';

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();

    const {
        data: product,
        isLoading: loadProduct,
        isError: errorProduct,
    } = useProductShopDetail(id as string);

    const { addItem } = useCart();

    const { mutate: checkout, isPending: isCheckingOut } = useCheckout({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success('Order placed successfully!');
                router.push(`/orders/${data.id}`);
            },
            onError: (error: any) => {
                const { message } = error.response?.data || {};
                toast.error(message || 'Checkout failed. Please try again.');
            },
        },
    });

    if (loadProduct) {
        return <p className="p-5">Loading...</p>;
    }

    if (errorProduct || !product) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Product not found or failed to load.</p>
            </div>
        );
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        checkout({
            items: [
                {
                    product_id: product.id,
                    item_qty: 1, // Default to 1 as there is no qty selector
                },
            ],
        });
    };

    return (
        <div className="mx-auto mt-10">
            <div className="grid grid-cols-2 gap-4">
                <div className="left-side max-w-[400px] flex flex-col gap-4">
                    <div className="w-full relative aspect-square bg-white border border-gray-100  overflow-hidden group">
                        {product.images.length > 0 ? (
                            <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                No image available
                            </div>
                        )}
                    </div>

                    {product.images.length > 1 && (
                        <div className="flex w-full gap-3 overflow-x-auto scrollbar-none pb-2">
                            {product.images.map((image, key) => (
                                <button
                                    key={key}
                                    className="relative w-full aspect-square overflow-hidden border-2 border-transparent hover:border-gray-300 opacity-70 hover:opacity-100 transition-all cursor-pointer focus:outline-none focus:border-black focus:opacity-100 bg-white"
                                >
                                    <img
                                        src={image.image_url}
                                        alt={`${product.name} thumbnail ${key + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="right-side">
                    <div className="flex flex-col gap-2 bg-gray-50 p-4">
                        <h1 className="text-2xl font-semibold">{product.name}</h1>

                        <p className="text-gray-500">
                            {product.description || 'No description available.'}
                        </p>

                        <p className="font-semibold text-xl">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            }).format(product.items[0].price || 0)}
                        </p>

                        <div className="flex items-center gap-1">
                            <p className="text-gray-500">Stock:</p>
                            <p className="font-medium">{product.items[0].qty_in_stock ?? 'N/A'}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <p className="text-gray-500">Shop:</p>
                            <p className="font-medium">{product.shop.shop_name}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <p className="text-gray-500">City:</p>
                            <p className="font-medium">{product.shop.shop_city}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <p className="text-gray-500">Category:</p>
                            <p className="font-medium">{product.category.category_name}</p>
                        </div>

                        <p className="text-sm text-gray-500">
                            Last updated:{' '}
                            {product.updated_at
                                ? new Date(product.updated_at).toLocaleDateString('id-ID')
                                : '-'}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleBuyNow}
                                variant="secondary"
                                className="cursor-pointer"
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? 'Processing...' : 'Buy Now'}
                            </Button>
                            <Button onClick={handleAddToCart} className="cursor-pointer">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Card className="overflow-hidden shadow-md border border-gray-100">
                <CardHeader className="bg-gray-50 pb-4">
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                    <CardDescription className="text-gray-500">
                        {product.description || 'No description available.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {product.images.map((image, key) => (
                        <img
                            key={key}
                            src={image.image_url}
                            alt={product.name}
                            className="w-full h-72 object-cover "
                        />
                    ))}
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <p className="text-gray-500">Price:</p>
                        <p className="font-semibold">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            }).format(product.items[0].price || 0)}
                        </p>

                        <p className="text-gray-500">Stock:</p>
                        <p className="font-medium">{product.items[0].qty_in_stock ?? 'N/A'}</p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center border-t pt-4 gap-5">
                    <p className="text-sm text-gray-500">
                        Last updated:{' '}
                        {product.updated_at
                            ? new Date(product.updated_at).toLocaleDateString('id-ID')
                            : '-'}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleBuyNow}
                            variant="secondary"
                            className="cursor-pointer"
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? 'Processing...' : 'Buy Now'}
                        </Button>
                        <Button onClick={handleAddToCart} className="cursor-pointer">
                            Add to Cart
                        </Button>
                    </div>
                </CardFooter>
            </Card> */}
        </div>
    );
}
