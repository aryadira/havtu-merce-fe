import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carts, AddToCartDTO, UpdateCartDTO } from '../../api/cart/cart';

// --- Query Keys ---
export const getCartsQueryKey = () => ['carts'];

// --- Hooks ---
export const useGetCarts = () => {
    return useQuery({
        queryKey: getCartsQueryKey(),
        queryFn: () => carts.getCarts(),
    });
};

export const useAddToCart = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddToCartDTO) => carts.addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
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
        mutationFn: (data: UpdateCartDTO) => carts.updateCartItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
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
            queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
            options?.onSuccess?.();
        },
        onError: (error) => options?.onError?.(error),
    });
};
