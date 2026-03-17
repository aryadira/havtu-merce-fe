import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orders } from '../../api/order/order';
import { CheckoutOrderDto } from '@/src/types/order';
import { Pagination } from '@/src/types/pagination';

const orderKeys = {
    key: ['order'] as const,
    carts: ['carts'] as const,
    lists: () => [...orderKeys.key, 'orders'] as const,
    page: (pagination: Pagination) => [...orderKeys.lists(), pagination] as const,
    item: () => [...orderKeys.key, 'item'] as const,
    details: (id: string | undefined) => [...orderKeys.item(), id] as const,
};

export const userOrders = (pagination: Pagination) => {
    return useQuery({
        queryKey: orderKeys.page(pagination),
        queryFn: () => orders.getOrders(pagination),
    });
};

export const userOrder = (id: string | undefined) => {
    return useQuery({
        queryKey: orderKeys.details(id),
        queryFn: () => orders.getOrder(id),
        enabled: !!id,
    });
};

export const useCheckout = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CheckoutOrderDto) => orders.checkout(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.carts });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};
