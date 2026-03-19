'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { useCart } from '@/src/context/cart-context';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCheckout } from '@/src/lib/hooks/order';
import { useProductShopDetail } from '@/src/lib/hooks/product/product-shop';
import { Minus, Plus, MessageSquare, Heart, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { PageLoader } from '@/src/components/ui/page-loader';
import { formatPrice } from '@/src/lib/utils';

export default function ProductDetail() {
    return (
        <Suspense fallback={<PageLoader message="Memuat produk..." />}>
            <ProductDetailContent />
        </Suspense>
    );
}

function ProductDetailContent() {
    const { id } = useParams();
    const router = useRouter();

    const {
        data: product,
        isLoading: loadProduct,
        isError: errorProduct,
    } = useProductShopDetail(id as string);

    const { addItem } = useCart();

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState<string>('');

    useEffect(() => {
        if (product) {
            const defaultItem = product.items?.find((i: any) => i.is_default) || product.items?.[0];
            setSelectedItem(defaultItem || null);

            if (product.images && product.images.length > 0) {
                setMainImage(product.images[0].image_url);
            }
        }
    }, [product]);

    useEffect(() => {
        // Reset quantity when selected item changes
        setQuantity(1);
    }, [selectedItem]);

    const { mutate: checkout, isPending: isCheckingOut } = useCheckout({
        onSuccess: (data) => {
            toast.success('Order placed successfully!');
            router.push(`/orders/${data.id}`);
        },
        onError: (error: any) => {
            const { message } = error.response?.data || {};
            toast.error(message || 'Checkout failed. Please try again.');
        },
    });

    if (loadProduct) {
        return <PageLoader message="Memuat produk..." />;
    }

    if (errorProduct || !product) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Product not found or failed to load.</p>
            </div>
        );
    }

    const maxStock = selectedItem ? selectedItem.qty_in_stock : 0;
    const isOutOfStock = maxStock === 0;

    const handleIncreaseQty = () => {
        if (quantity < maxStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            if (val > maxStock) setQuantity(maxStock);
            else if (val < 1) setQuantity(1);
            else setQuantity(val);
        } else {
            setQuantity(1);
        }
    };

    const handleAddToCart = () => {
        if (!selectedItem || isOutOfStock) return;
        // addItem(product, quantity, selectedItem);
        toast.success(`${product.name} ready to be added to cart`);
    };

    const handleBuyNow = () => {
        if (!selectedItem || isOutOfStock) return;

        // Simpan kuantitas ke sessionStorage agar tidak muncul di query string
        sessionStorage.setItem('checkout_qty', quantity.toString());

        router.push(`/checkout?product_id=${product.id}&item_id=${selectedItem.id}`);
    };


    // Helper to get configuration name combination
    const getConfigName = (item: any) => {
        if (!item.configurations || item.configurations.length === 0) return item.sku || 'Default';
        return item.configurations.map((c: any) => c.product_variation_option.value).join(' / ');
    };

    const selectedConfigName = selectedItem ? getConfigName(selectedItem) : '';
    const subtotal = selectedItem ? selectedItem.price * quantity : 0;

    return (
        <div className="max-w-7xl mx-auto mt-8 px-4 pb-20">
            {/* Breadcrumbs can go here */}
            {/* ... */}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative items-start">
                {/* Left Column: Images (col-span-4) */}
                <div className="md:col-span-4 flex flex-col gap-4 sticky top-24">
                    <div className="w-full relative aspect-square bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="text-gray-400">No image</div>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex w-full gap-3 overflow-x-auto scrollbar-none pb-2">
                            {product.images.map((img: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img.image_url)}
                                    className={`relative w-16 h-16 overflow-hidden border-2 transition-all ${
                                        mainImage === img.image_url
                                            ? 'border-primary'
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={`${product.name} thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Middle Column: Details & Variations (col-span-5) */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-semibold leading-snug">{product.name}</h1>
                        {/* <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span>Sold 100+</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">⭐ 4.9 (312 rating)</span>
                        </div> */}
                    </div>

                    <div className="text-3xl font-bold text-primary">
                        {selectedItem
                            ? formatPrice(selectedItem.price)
                            : formatPrice(product.items[0]?.price || 0)}
                    </div>

                    <div className="w-full h-px bg-gray-200" />

                    {/* Variations Grid */}
                    {product.items && product.items.length > 0 && (
                        <div>
                            <p className="font-semibold mb-3">
                                Pilih Varian:{' '}
                                <span className="text-gray-600 font-normal">
                                    {selectedConfigName}
                                </span>
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {product.items.map((item: any) => {
                                    const isSelected = selectedItem?.id === item.id;
                                    const isItemOutOfStock = item.qty_in_stock === 0;
                                    return (
                                        <button
                                            key={item.id}
                                            disabled={isItemOutOfStock}
                                            onClick={() => setSelectedItem(item)}
                                            className={`px-4 py-2 border text-sm transition-all focus:outline-none ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                                    : isItemOutOfStock
                                                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                      : 'border-gray-200 hover:border-primary/50 text-gray-700'
                                            }`}
                                        >
                                            {getConfigName(item)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="w-full h-px bg-gray-200" />

                    <Tabs defaultValue="detail" className="w-full">
                        <TabsList className="w-full justify-start border-b border-gray-200 h-auto bg-transparent p-0 gap-6">
                            <TabsTrigger
                                value="detail"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent px-0 py-3 font-semibold text-gray-500"
                            >
                                Detail Produk
                            </TabsTrigger>
                            <TabsTrigger
                                value="specs"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent px-0 py-3 font-semibold text-gray-500"
                            >
                                Spesifikasi
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent px-0 py-3 font-semibold text-gray-500"
                            >
                                Info Penting
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="detail"
                            className="pt-4 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap"
                        >
                            {product.description || 'No description available for this product.'}
                        </TabsContent>
                        <TabsContent value="specs" className="pt-4 text-gray-700 text-sm">
                            <div className="grid grid-cols-3 gap-y-3">
                                <span className="text-gray-500 font-medium">Kategori</span>
                                <span className="col-span-2 text-primary">
                                    {product.category.category_name}
                                </span>
                                <span className="text-gray-500 font-medium">Kondisi</span>
                                <span className="col-span-2">Baru</span>
                                <span className="text-gray-500 font-medium">Min. Pemesanan</span>
                                <span className="col-span-2">1 Buah</span>
                                <span className="text-gray-500 font-medium">Etalase</span>
                                <span className="col-span-2 text-primary">All Product</span>
                            </div>
                        </TabsContent>
                        <TabsContent value="info" className="pt-4 text-gray-700 text-sm">
                            Informasi penting belum ditambahkan oleh penjual.
                        </TabsContent>
                    </Tabs>

                    {/* Shop Info Section */}
                    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100 mt-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {product.shop.shop_logo ? (
                                <img
                                    src={product.shop.shop_logo}
                                    alt={product.shop.shop_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">Shop</span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold">{product.shop.shop_name}</p>
                            <p className="text-xs text-gray-500">
                                Online • {product.shop.shop_city}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto font-semibold border-primary text-primary hover:bg-primary/5"
                        >
                            Follow
                        </Button>
                    </div>
                </div>

                {/* Right Column: Checkout Card (col-span-3) */}
                <div className="md:col-span-3">
                    <Card className="sticky top-24 border-gray-200 overflow-hidden p-4">
                        <h3 className="font-semibold text-base mb-4">Atur jumlah dan catatan</h3>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 min-w-[3rem] bg-gray-100 overflow-hidden">
                                {mainImage && (
                                    <img
                                        src={mainImage}
                                        className="w-full h-full object-cover"
                                        alt="thumbnail"
                                    />
                                )}
                            </div>
                            <p className="text-sm font-medium line-clamp-2 leading-tight">
                                {selectedConfigName}
                            </p>
                        </div>

                        <div className="w-full h-px bg-gray-100 mb-4" />

                        <div className="flex items-center justify-start gap-4 mb-5">
                            <div className="flex items-center border border-gray-300 py-1 px-2 h-9">
                                <button
                                    onClick={handleDecreaseQty}
                                    disabled={quantity <= 1 || isOutOfStock}
                                    className="p-1 text-gray-500 hover:text-black disabled:text-gray-300 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    disabled={isOutOfStock}
                                    className="w-10 text-center font-medium outline-none text-sm bg-transparent"
                                />
                                <button
                                    onClick={handleIncreaseQty}
                                    disabled={quantity >= maxStock || isOutOfStock}
                                    className="p-1 text-primary hover:text-primary-dark disabled:text-gray-300 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-sm">
                                Stok:{' '}
                                <span className="font-semibold">
                                    {isOutOfStock ? 'Habis' : maxStock}
                                </span>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex flex-col gap-1 mb-6">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Subtotal</span>
                                {selectedItem?.price && (
                                    <span className="line-through text-xs">
                                        {formatPrice(selectedItem.price * 1.3)}{' '}
                                        {/* Fake crossed out price */}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-white text-xs">Sub</span> {/* spacing */}
                                <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mb-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
                            >
                                + Keranjang
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                variant="outline"
                                className="w-full h-11 border-primary text-primary font-semibold hover:bg-primary/5"
                            >
                                Beli Langsung
                            </Button>
                        </div>

                        {/* Small links (Chat, Wishlist, Share) */}
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 px-2 pt-2">
                            <button className="flex items-center gap-1.5 hover:text-primary">
                                <MessageSquare className="w-4 h-4" /> Chat
                            </button>
                            <div className="w-px h-4 bg-gray-300" />
                            <button className="flex items-center gap-1.5 hover:text-primary">
                                <Heart className="w-4 h-4" /> Wishlist
                            </button>
                            <div className="w-px h-4 bg-gray-300" />
                            <button className="flex items-center gap-1.5 hover:text-primary">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
