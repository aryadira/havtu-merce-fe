import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orders } from '../../api/orders/orders';
import { CheckoutOrderDto } from '@/src/types/order';

// --- Query Keys ---
export const getOrdersQueryKey = (page: number, limit: number) => ['orders', page, limit];
export const getOrdersManageQueryKey = (page: number, limit: number) => [
    'orders-manage',
    page,
    limit,
];
export const getOrderQueryKey = (orderId: string) => ['order', orderId];
export const getShippingMethodsQueryKey = () => ['shipping-methods'];

// --- Hooks ---
export const useGetOrders = (page: number, limit: number) => {
    return useQuery({
        queryKey: getOrdersQueryKey(page, limit),
        queryFn: () => orders.getOrders(page, limit),
    });
};

export const useGetOrdersManage = (page: number, limit: number) => {
    return useQuery({
        queryKey: getOrdersManageQueryKey(page, limit),
        queryFn: () => orders.getOrdersManage(page, limit),
    });
};

export const useGetOrder = (orderId: string) => {
    return useQuery({
        queryKey: getOrderQueryKey(orderId),
        queryFn: () => orders.getOrder(orderId),
        enabled: !!orderId,
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
            queryClient.invalidateQueries({ queryKey: ['carts'] });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useGetShippingMethods = () => {
    return useQuery({
        queryKey: getShippingMethodsQueryKey(),
        queryFn: () => orders.getShippingMethods(),
    });
};
