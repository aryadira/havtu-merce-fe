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

interface OrderDetailActionsProps {
    orderId: string;
}

export function OrderActions({ orderId }: OrderDetailActionsProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);

    return (
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
                        // TODO: Navigate to detail page for seller/admin
                        // router.push(`/orders/manage/${orderId}`)
                        toast.info('Detail page for seller not implemented yet.');
                    }}
                >
                    View Details
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
