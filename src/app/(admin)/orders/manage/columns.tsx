import { OrderResponse } from '@/src/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { formatPrice } from '@/src/lib/utils';
import { Pagination } from '@/src/types/pagination';
import { OrderActions } from './page';

export const getOrderColumns = (pagination: Pagination): ColumnDef<OrderResponse>[] => [
    {
        accessorKey: 'order_number',
        header: 'Order #',
        cell: ({ row }) => <div className="text-xs font-bold">{row.getValue('order_number')}</div>,
    },
    {
        accessorKey: 'user_id',
        header: 'User ID',
        cell: ({ row }) => (
            <div
                className="text-[10px] text-muted-foreground truncate max-w-[80px]"
                title={row.getValue('user_id')}
            >
                {row.getValue('user_id')}
            </div>
        ),
    },
    {
        accessorKey: 'order_total',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = Number(row.getValue('order_total'));
            const formatted = formatPrice(amount);
            return <div className="text-right font-bold text-emerald-600">{formatted}</div>;
        },
    },
    {
        accessorKey: 'order_status_id',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.order_status;
            const statusId = row.original.order_status_id;
            return (
                <div className="font-medium text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-1 rounded w-fit">
                    {status?.label || statusId.split('-')[0]}
                </div>
            );
        },
    },
    {
        accessorKey: 'payment_status_id',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.payment_status;
            const statusId = row.original.payment_status_id;
            const slug = status?.slug || (statusId.includes('46b3e972') ? 'unpaid' : ''); // Fallback based on provided example ID if needed, but better to just show label if exists

            return (
                <div
                    className={`text-[10px] font-bold uppercase ${
                        slug === 'paid'
                            ? 'text-green-600'
                            : slug === 'unpaid'
                              ? 'text-red-500'
                              : 'text-gray-500'
                    }`}
                >
                    {status?.label || (slug === 'unpaid' ? 'UNPAID' : statusId.split('-')[0])}
                </div>
            );
        },
    },
    {
        accessorKey: 'shipping_address',
        header: 'Shipping Address',
        cell: ({ row }) => {
            const addressStr = row.getValue('shipping_address') as string;
            try {
                const addr = JSON.parse(addressStr);
                return (
                    <div
                        className="text-[10px] leading-tight max-w-[150px] truncate"
                        title={`${addr.street}, ${addr.city}`}
                    >
                        {addr.street}, {addr.city}
                    </div>
                );
            } catch (e) {
                return <div className="text-[10px] truncate max-w-[150px]">{addressStr}</div>;
            }
        },
    },
    {
        accessorKey: 'created_at',
        header: () => <div className="text-right">Ordered At</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return (
                <div className="text-right text-xs">
                    {date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <OrderActions orderId={row.original.id} />,
    },
];
