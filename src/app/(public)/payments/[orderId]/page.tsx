'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { userOrder } from '@/src/lib/hooks/order';
import { PageLoader } from '@/src/components/ui/page-loader';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
    Clock,
    Copy,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    ShieldCheck,
    Banknote,
    ChevronRight,
    PackageCheck,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/src/lib/utils';
import { containerVariants, itemVariants } from '@/src/lib/constants/animations';
import { usePay } from '@/src/lib/hooks/payment';

const PAYMENT_DURATION_SECONDS = 60 * 60; // 1 hour

function getDeadlineKey(orderId: string) {
    return `payment_deadline_${orderId}`;
}

function getOrSetDeadline(orderId: string): number {
    if (typeof window === 'undefined') return Date.now() + PAYMENT_DURATION_SECONDS * 1000;
    const stored = localStorage.getItem(getDeadlineKey(orderId));
    if (stored) return parseInt(stored, 10);
    const deadline = Date.now() + PAYMENT_DURATION_SECONDS * 1000;
    localStorage.setItem(getDeadlineKey(orderId), String(deadline));
    return deadline;
}

function useCountdown(orderId: string) {
    const [secondsLeft, setSecondsLeft] = useState<number>(PAYMENT_DURATION_SECONDS);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const deadline = getOrSetDeadline(orderId);
        const tick = () => {
            const remaining = Math.floor((deadline - Date.now()) / 1000);
            if (remaining <= 0) {
                setSecondsLeft(0);
                setIsExpired(true);
            } else {
                setSecondsLeft(remaining);
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [orderId]);

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    return { hours, minutes, seconds, isExpired, secondsLeft };
}

export default function PaymentPage() {
    return (
        <Suspense
            fallback={
                <PageLoader
                    message="Memuat halaman pembayaran..."
                    spinnerColor="text-emerald-500"
                />
            }
        >
            <PaymentPageContent />
        </Suspense>
    );
}

function PaymentPageContent() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const { data: order, isLoading } = userOrder(orderId);
    const { hours, minutes, seconds, isExpired } = useCountdown(orderId);
    const [copied, setCopied] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const orderNumber = order?.order_number ?? '—';
    const total = order ? Number(order.order_total) : 0;

    const pad = (n: number) => String(n).padStart(2, '0');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Disalin ke clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const urgencyColor = () => {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total > 1800) return 'text-emerald-600 bg-emerald-50 border-emerald-200'; // > 30 min
        if (total > 600) return 'text-amber-600 bg-amber-50 border-amber-200'; // > 10 min
        return 'text-red-600 bg-red-50 border-red-200'; // < 10 min
    };

    const { mutate: pay, isPending: isPaying } = usePay({
        onSuccess: (data) => {
            toast.success('Payment success');
            setIsRedirecting(true);
            router.push('/orders');
        },
        onError: (error) => {
            toast.error('Payment failed');
        },
    });

    const handlePayNow = () => {
        pay(orderId);
    };

    if (isLoading) {
        return <PageLoader message="Memuat detail pesanan..." spinnerColor="text-emerald-500" />;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pt-8 pb-32"
        >
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <PackageCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-emerald-600 font-semibold">
                            Pesanan berhasil dibuat!
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Selesaikan Pembayaran</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Lakukan transfer sesuai nominal yang tertera sebelum waktu habis.
                    </p>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div variants={itemVariants}>
                    <Card className={`p-5 mb-5 border ${urgencyColor()} shadow-none`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Clock
                                    className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-current'}`}
                                />
                                <span className="font-semibold text-[15px]">
                                    {isExpired
                                        ? 'Waktu Pembayaran Habis'
                                        : 'Batas Waktu Pembayaran'}
                                </span>
                            </div>

                            {!isExpired ? (
                                <div className="flex items-center gap-1.5">
                                    {[pad(hours), pad(minutes), pad(seconds)].map((val, i) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="bg-white border border-current/20 px-3 py-1.5 text-center min-w-[48px]">
                                                <span className="text-2xl font-bold tabular-nums leading-none">
                                                    {val}
                                                </span>
                                                <p className="text-[9px] mt-0.5 opacity-60 uppercase tracking-widest">
                                                    {i === 0 ? 'jam' : i === 1 ? 'mnt' : 'dtk'}
                                                </p>
                                            </div>
                                            {i < 2 && (
                                                <span className="text-xl font-bold opacity-50">
                                                    :
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Badge variant="destructive" className="text-sm px-3 py-1">
                                    Kedaluwarsa
                                </Badge>
                            )}
                        </div>

                        {isExpired && (
                            <div className="mt-4 p-3 bg-red-100 flex items-start gap-2 text-red-700 text-sm">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>
                                    Batas waktu pembayaran telah habis. Pesananmu mungkin akan
                                    dibatalkan secara otomatis. Silakan hubungi CS kami jika masih
                                    ingin melanjutkan.
                                </span>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Order Info */}
                <motion.div variants={itemVariants}>
                    <Card className="p-5 mb-5 border border-gray-200">
                        <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Informasi Pesanan
                        </h2>

                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-gray-500">No. Pesanan</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800">
                                            {orderNumber}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(orderNumber)}
                                            className="text-gray-400 hover:text-emerald-500 transition-colors"
                                            title="Salin nomor pesanan"
                                        >
                                            {copied ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500">Status Pembayaran</span>
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
                                        {order?.payment_status?.label ?? 'Menunggu Pembayaran'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500">Status Pesanan</span>
                                    <span className="font-medium text-gray-700">
                                        {order?.order_status?.label ?? '—'}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-[15px] text-gray-800">
                                        Total Tagihan
                                    </span>
                                    <span className="font-bold text-xl text-gray-900">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Payment Instructions */}
                <motion.div variants={itemVariants}>
                    <Card className="p-5 mb-5 border border-gray-200">
                        <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Cara Pembayaran
                        </h2>

                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    step: 1,
                                    icon: <Banknote className="w-4 h-4 text-emerald-500" />,
                                    title: 'Salin nomor pesanan & total tagihan',
                                    desc: 'Gunakan nomor pesanan sebagai berita acara transfer.',
                                },
                                {
                                    step: 2,
                                    icon: <ArrowRight className="w-4 h-4 text-emerald-500" />,
                                    title: 'Lakukan transfer ke rekening tujuan',
                                    desc: 'Sesuai metode pembayaran yang kamu pilih saat checkout.',
                                },
                                {
                                    step: 3,
                                    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                                    title: 'Konfirmasi pembayaran',
                                    desc: 'Pembayaran akan dikonfirmasi otomatis atau dalam 1×24 jam.',
                                },
                            ].map(({ step, icon, title, desc }) => (
                                <div key={step} className="flex items-start gap-3">
                                    <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[11px] font-bold text-emerald-600">
                                            {step}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            {icon}
                                            <p className="text-[14px] font-semibold text-gray-800">
                                                {title}
                                            </p>
                                        </div>
                                        <p className="text-[13px] text-gray-500">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <Button
                        onClick={handlePayNow}
                        disabled={isExpired || isPaying || isRedirecting}
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-[15px] font-bold"
                    >
                        {isRedirecting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Redirecting...
                            </div>
                        ) : isPaying ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Process Payment...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                Bayar Sekarang <ChevronRight className="w-4 h-4" />
                            </div>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="w-full h-11 text-[14px] text-gray-600"
                    >
                        Kembali ke Beranda
                    </Button>
                </motion.div>

                <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed px-4">
                    Butuh bantuan?{' '}
                    <span className="border-b border-gray-300 cursor-pointer hover:text-gray-600 pb-px">
                        Hubungi Customer Service
                    </span>{' '}
                    kami.
                </p>
            </div>
        </motion.div>
    );
}
