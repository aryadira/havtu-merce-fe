import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carts } from '../../api/cart';
import { AddToCartDto, UpdateCartDto } from '@/src/types/cart';

const cartKeys = {
    key: ['cart'] as const,
    lists: () => [...cartKeys.key, 'lists'] as const,
}

export const useGetCarts = () => {
    return useQuery({
        queryKey: cartKeys.lists(),
        queryFn: () => carts.getCarts(),
    });
};

export const useAddToCart = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddToCartDto) => carts.addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
            options?.onSuccess?.();
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useUpdateCartItem = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateCartDto) => carts.updateCartItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
            options?.onSuccess?.();
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useRemoveCartItem = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => carts.removeCartItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
            options?.onSuccess?.();
        },
        onError: (error) => options?.onError?.(error),
    });
};
