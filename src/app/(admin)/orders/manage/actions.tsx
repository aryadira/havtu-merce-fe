'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { OrderResponse } from '@/src/types/order';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog';
import { EvidenceVerification } from '@/src/components/payment/evidence-verification';

interface OrderDetailActionsProps {
    order: OrderResponse;
}

export function OrderActions({ order }: OrderDetailActionsProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const [showVerification, setShowVerification] = useState(false);

    const needsVerification = order.transaction?.evidence_url && order.transaction?.status === 'waiting_verification';

    return (
        <div className="flex items-center gap-2">
            {needsVerification && (
                <Button 
                    size="sm" 
                    variant="default"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold px-3 py-0"
                    onClick={() => setShowVerification(true)}
                >
                    Verify Payment
                </Button>
            )}

            <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                            toast.info('Detail page for seller not implemented yet.');
                        }}
                    >
                        View Details
                    </DropdownMenuItem>
                    {!needsVerification && order.transaction?.evidence_url && (
                         <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setShowVerification(true)}
                        >
                            View Evidence
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showVerification} onOpenChange={setShowVerification}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verifikasi Bukti Bayar</DialogTitle>
                        <DialogDescription>
                            Pesanan #{order.order_number}
                        </DialogDescription>
                    </DialogHeader>
                    {order.transaction?.evidence_url ? (
                        <EvidenceVerification 
                            orderId={order.id}
                            evidenceUrl={order.transaction?.evidence_url}
                            status={order.transaction?.status}
                            onSuccess={() => setShowVerification(false)}
                        />
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground text-sm">Bukti pembayaran tidak ditemukan.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
