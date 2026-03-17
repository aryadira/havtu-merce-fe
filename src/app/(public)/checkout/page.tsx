'use client';

import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { useCheckout } from '@/src/lib/hooks/order';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useProductShopDetail } from '@/src/lib/hooks/product/product-shop';
import { MapPin, ShieldCheck, TicketPercent, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { motion } from 'framer-motion';
import { PageLoader } from '@/src/components/ui/page-loader';
import { useProfile } from '@/src/lib/hooks/user';
import { useShippingMethods } from '@/src/lib/hooks/shipping-method';
import { useUserPaymentMethods } from '@/src/lib/hooks/user/user-payment-method';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/src/components/ui/dialog';
import { Badge } from '@/src/components/ui/badge';
import { containerVariants, itemVariants } from '@/src/lib/constants/animations';
import { formatPrice } from '@/src/lib/utils';

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <PageLoader message="Menyiapkan pembayaran..." spinnerColor="text-emerald-500" />
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const params = useSearchParams();
    const router = useRouter();

    const productId = params.get('product_id');
    const itemId = params.get('item_id');
    const qtyParam = params.get('qty');

    const { data: userData, isLoading: isLoadingUser } = useProfile();
    const { data: shippingMethods, isLoading: isLoadingShipping } = useShippingMethods();
    const { data: product, isLoading: isLoadingProduct } = useProductShopDetail(productId as string);
    const { data: userPaymentMethods, isLoading: isLoadingPayment } = useUserPaymentMethods();

    const user = userData;
    const addresses = user?.profile?.addresses || [];
    const paymentMethodsList = userPaymentMethods || [];
    const shippingList = shippingMethods || [];

    const [quantity, setQuantity] = useState(1);
    const [isInitialized, setIsInitialized] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [shippingMethodId, setShippingMethodId] = useState('');
    const [userPaymentMethodId, setUserPaymentMethodId] = useState('');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [extraProtection, setExtraProtection] = useState(true);
    const [shippingInsurance, setShippingInsurance] = useState(false);
    const [note, setNote] = useState('');

    const selectedItem = product?.items?.find((i: any) => i.id === itemId) || product?.items?.[0];
    const mainImage = product?.images?.[0]?.image_url || '';

    const variantName =
        selectedItem?.configurations
            ?.map((c: any) => c.product_variation_option?.value)
            .join(', ') || '';

    const { mutate: checkout, isPending: isCheckingOut } = useCheckout({
        onSuccess: (data) => {
            toast.success('Pesanan berhasil dibuat!');
            setTimeout(() => {
                router.push(`/orders`);
            }, 500);
        },
        onError: (error: any) => {
            const { message, messages } = error.response?.data || {};
            toast.error(messages?.join(', ') || message || 'Checkout failed.');
        },
    });

    const handleCheckout = () => {
        if (!itemId || !quantity || !selectedAddress || !shippingMethodId || !userPaymentMethodId) {
            toast.error('Mohon lengkapi alamat dan metode pembayaran.');
            return;
        }
        checkout({
            items: [
                {
                    product_id: itemId, // Backend expects ProductItem ID
                    qty_in_stock: quantity,
                },
            ],
            shipping_address: {
                street: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.province,
                postal_code: selectedAddress.postal_code,
                country: selectedAddress.country,
            },
            shipping_method_id: shippingMethodId,
            user_payment_method_id: userPaymentMethodId,
        });
    };

    const handleIncrease = () => {
        const maxStock = selectedItem?.qty_in_stock || 999;
        if (quantity < maxStock) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.error(`Stok maksimal adalah ${maxStock}`);
        }
    };

    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const storedQty = sessionStorage.getItem('checkout_qty');
        if (storedQty) {
            setQuantity(parseInt(storedQty));
        } else if (qtyParam) {
            setQuantity(parseInt(qtyParam));
        }
        setIsInitialized(true);
    }, [qtyParam]);

    useEffect(() => {
        if (isInitialized) {
            sessionStorage.setItem('checkout_qty', quantity.toString());
        }
    }, [quantity, isInitialized]);

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses]);

    useEffect(() => {
        if (shippingList.length > 0 && !shippingMethodId) {
            setShippingMethodId(shippingList[0].id);
        }
    }, [shippingList, shippingMethodId]);

    useEffect(() => {
        if (paymentMethodsList.length > 0 && !userPaymentMethodId) {
            setUserPaymentMethodId(paymentMethodsList[0].id);
        }
    }, [paymentMethodsList, userPaymentMethodId]);

    const price = selectedItem?.price || 0;
    const subtotal = price * quantity;
    const shippingCost = shippingList.find((s: any) => s.id === shippingMethodId)?.price || 0;
    const protectionCost = extraProtection ? 84500 : 0;
    const insuranceCost = shippingInsurance ? 52300 : 0;
    const discount = 20000;

    const totalPayment = subtotal + shippingCost + protectionCost + insuranceCost - discount;

    if (isLoadingUser || isLoadingShipping || isLoadingProduct || isLoadingPayment) {
        return <PageLoader message="Menyiapkan pembayaran..." spinnerColor="text-emerald-500" />;
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Produk tidak ditemukan atau gagal dimuat.</p>
                <Button onClick={() => router.back()} className="mt-4">
                    Kembali
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pt-8 pb-32"
        >
            <div className="max-w-6xl mx-auto px-4">
                <motion.h1
                    variants={itemVariants}
                    className="text-2xl font-semibold mb-6 text-gray-800"
                >
                    Checkout
                </motion.h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start relative">
                    {/* Left Column */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full lg:w-2/3 flex flex-col gap-5"
                    >
                        {/* Alamat Pengiriman */}
                        <Card className="p-5 border border-gray-200">
                            <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Alamat Pengiriman
                            </h2>
                            <div className="flex items-start justify-between">
                                {selectedAddress ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <span className="font-semibold text-[15px]">
                                                {selectedAddress.is_default ? 'Utama' : 'Rumah'}{' '}
                                                <span className="text-gray-400 font-normal mx-1">
                                                    •
                                                </span>{' '}
                                                {user?.profile?.fullname}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-[15px] leading-relaxed max-w-xl">
                                            {selectedAddress.address}, {selectedAddress.city},{' '}
                                            {selectedAddress.province}, {selectedAddress.country},{' '}
                                            {user?.profile?.phone_number}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-red-500">
                                        Alamat belum diatur. Silakan tambah alamat di profil.
                                    </p>
                                )}

                                <Dialog
                                    open={isAddressModalOpen}
                                    onOpenChange={setIsAddressModalOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full text-xs font-semibold h-8 px-4 text-gray-600 border-gray-300"
                                        >
                                            {selectedAddress ? 'Ganti Alamat' : 'Atur Alamat'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                                        <DialogHeader className="p-6 pb-0">
                                            <DialogTitle>Pilih Alamat Pengiriman</DialogTitle>
                                        </DialogHeader>
                                        <div className="p-6 max-h-[60vh] overflow-y-auto flex flex-col gap-3">
                                            {addresses.map((addr: any, idx: number) => (
                                                <div
                                                    key={addr.id || idx}
                                                    onClick={() => {
                                                        setSelectedAddress(addr);
                                                        setIsAddressModalOpen(false);
                                                    }}
                                                    className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all hover:border-emerald-500 hover:bg-emerald-50/30 ${
                                                        selectedAddress?.id === addr.id
                                                            ? 'border-emerald-500 bg-emerald-50/50'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-bold text-sm text-gray-800">
                                                            {user?.profile?.fullname}
                                                        </span>
                                                        {addr.is_default && (
                                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] h-5 border-emerald-200">
                                                                Utama
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        {user?.profile?.phone_number}
                                                    </p>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {addr.address}, {addr.city}, {addr.province}
                                                        , {addr.postal_code}, {addr.country}
                                                    </p>
                                                    {selectedAddress?.id === addr.id && (
                                                        <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                            <Check className="w-3.5 h-3.5" />{' '}
                                                            Terpilih
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <Button
                                                variant="outline"
                                                className="mt-2 border-dashed border-2 py-6 text-gray-500 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50"
                                                onClick={() => router.push('/profile')}
                                            >
                                                Tambah Alamat Baru
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>

                        {/* Store & Products Section */}
                        <Card className="p-0 border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
                                <span className="bg-purple-600 text-white p-0.5">
                                    <Check className="w-3 h-3" />
                                </span>
                                <span className="font-bold text-[15px]">
                                    {product?.shop?.shop_name || 'Studio Ponsel Store'}
                                </span>
                            </div>

                            <div className="p-5 flex flex-col gap-4">
                                {/* Product Summary Row */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-16 h-16 border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                                            {mainImage && (
                                                <img
                                                    src={mainImage}
                                                    className="w-full h-full object-cover"
                                                    alt="Product"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[15px] text-gray-800 leading-snug line-clamp-2">
                                                {product?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{variantName}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <p className="font-bold text-base">{formatPrice(price)}</p>
                                        <div className="flex items-center border border-gray-300 py-1 px-2 h-8">
                                            <button
                                                onClick={handleDecrease}
                                                className="text-gray-400 hover:text-gray-600 leading-none"
                                            >
                                                <span className="text-lg">−</span>
                                            </button>
                                            <input
                                                type="text"
                                                value={quantity}
                                                readOnly
                                                className="w-8 text-center text-sm font-medium outline-none bg-transparent"
                                            />
                                            <button
                                                onClick={handleIncrease}
                                                className="text-emerald-500 hover:text-emerald-600 leading-none text-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Proteksi Gadget Ekstra */}
                                <div className="flex items-center gap-2 mt-2">
                                    <div
                                        className={`w-5 h-5 border ${extraProtection ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'} flex items-center justify-center cursor-pointer`}
                                        onClick={() => setExtraProtection(!extraProtection)}
                                    >
                                        {extraProtection && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[14px] text-emerald-600 border-b border-dashed border-emerald-600 cursor-pointer">
                                        Proteksi Gadget Ekstra 12 bulan
                                    </span>
                                    <span className="text-[14px] text-gray-500 ml-1">
                                        (Rp84.500)
                                    </span>
                                </div>

                                {/* Shipping Options */}
                                <div className="border border-gray-200 overflow-hidden mt-2">
                                    {shippingList.length > 0 ? (
                                        <div className="flex flex-col">
                                            {shippingList.map((s: any) => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => setShippingMethodId(s.id)}
                                                    className={`p-4 flex justify-between items-center cursor-pointer border-b last:border-b-0 transition-colors ${
                                                        shippingMethodId === s.id
                                                            ? 'bg-emerald-50/50'
                                                            : 'bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-[15px]">
                                                            {s.provider} ({formatPrice(s.price)})
                                                        </p>
                                                        <p className="text-[13px] text-gray-500 mt-0.5">
                                                            {s.description ||
                                                                'Estimasi tiba 2 - 4 hari'}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                            shippingMethodId === s.id
                                                                ? 'border-emerald-500 bg-emerald-500'
                                                                : 'border-gray-300'
                                                        }`}
                                                    >
                                                        {shippingMethodId === s.id && (
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="p-4 text-sm text-gray-500">
                                            Metode pengiriman tidak tersedia.
                                        </p>
                                    )}

                                    <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center gap-2">
                                        <div
                                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center cursor-pointer 
                                                ${shippingInsurance ? 'border-primary' : 'border-gray-300'}`}
                                            onClick={() => setShippingInsurance(!shippingInsurance)}
                                        >
                                            {shippingInsurance && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <span
                                            className="text-[14px] text-gray-600 cursor-pointer"
                                            onClick={() => setShippingInsurance(!shippingInsurance)}
                                        >
                                            Pakai Asuransi Pengiriman
                                        </span>
                                        <span className="text-[14px] text-gray-500">
                                            (Rp52.300)
                                        </span>
                                    </div>
                                </div>

                                {/* Add Note */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-1">
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Kasih Catatan"
                                        maxLength={200}
                                        className="text-[14px] outline-none flex-1 placeholder:text-gray-400 bg-transparent"
                                    />
                                    <span className="text-[13px] text-gray-400">
                                        {note.length}/200 &gt;
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right Column: Summaries & Payment */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full lg:w-1/3 flex flex-col gap-4 sticky top-24"
                    >
                        {/* Payment Methods */}
                        <Card className="p-5 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[15px]">Metode Pembayaran</h3>
                                <span className="text-[13px] text-emerald-600 font-semibold cursor-pointer">
                                    Lihat Semua
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {paymentMethodsList.map((pm: any) => (
                                    <div
                                        key={pm.id}
                                        className="flex justify-between items-center cursor-pointer p-3 border border-transparent hover:border-emerald-200 hover:bg-emerald-50/30 rounded-lg transition-all"
                                        onClick={() => setUserPaymentMethodId(pm.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-[10px] font-bold text-emerald-700 border border-gray-200">
                                                {pm.provider}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-semibold">
                                                    Transfer {pm.provider}
                                                </span>
                                                <span className="text-[12px] text-gray-500">
                                                    {pm.account_number} • {pm.account_holder}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${
                                                userPaymentMethodId === pm.id
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : 'border-gray-300 bg-white'
                                            }`}
                                        >
                                            {userPaymentMethodId === pm.id && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {paymentMethodsList.length === 0 && (
                                    <p className="text-sm text-gray-400 italic p-2">
                                        Metode pembayaran belum ditambahkan. Silakan tambah di
                                        profil.
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Promo Block */}
                        <Card className="p-4 border border-gray-200 mb-1">
                            <div className="border border-emerald-200 bg-emerald-50/50 p-3 flex justify-between items-center cursor-pointer hover:bg-emerald-50">
                                <div className="flex items-center gap-2">
                                    <TicketPercent className="w-5 h-5 text-amber-500" />
                                    <span className="text-[14px] text-gray-700 font-medium">
                                        Makin hemat pakai promo
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex justify-between text-[13px] pt-4 px-1">
                                <span className="text-gray-500">Diskon Barang</span>
                                <span className="text-emerald-500 font-medium">- Rp20.000</span>
                            </div>
                        </Card>

                        {/* Ringkasan Transaksi */}
                        <Card className="p-5 border border-gray-200">
                            <h3 className="font-bold text-[15px] mb-4">
                                Cek ringkasan transaksimu, yuk
                            </h3>

                            <div className="flex flex-col gap-2.5 mb-5 border-b border-gray-200 pb-5">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500">
                                        Total Harga ({quantity} Barang)
                                    </span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500">Total Ongkos Kirim</span>
                                    <span>{formatPrice(shippingCost)}</span>
                                </div>
                                {extraProtection && (
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-gray-500">Proteksi Gadget</span>
                                        <span>{formatPrice(protectionCost)}</span>
                                    </div>
                                )}
                                {shippingInsurance && (
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-gray-500">Asuransi Pengiriman</span>
                                        <span>{formatPrice(insuranceCost)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500">Total Diskon Barang</span>
                                    <span className="text-emerald-500">
                                        - {formatPrice(discount)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-5">
                                <span className="font-bold text-[16px] text-gray-800">
                                    Total Tagihan
                                </span>
                                <span className="font-bold text-xl">
                                    {formatPrice(totalPayment)}
                                </span>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full text-[16px] h-12 bg-emerald-500 hover:bg-emerald-600 font-bold"
                            >
                                {isCheckingOut ? (
                                    'Sedang Memproses...'
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" /> Bayar Sekarang
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-[10px] text-gray-400 mt-4 px-2 leading-relaxed">
                                Dengan melanjutkan pembayaran, kamu menyetujui S&K{' '}
                                <span className="border-b border-gray-400 pb-px cursor-pointer">
                                    Asuransi Pengiriman & Proteksi
                                </span>
                                .
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
