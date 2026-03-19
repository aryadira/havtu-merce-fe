import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payment } from '../../api/payment/payment';

const orderKeys = {
    key: ['order'] as const,
    item: () => [...orderKeys.key, 'item'] as const,
    details: (id: string | undefined) => [...orderKeys.item(), id] as const,
};

export const usePay = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) => payment.pay(orderId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.details(data.id) });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};
