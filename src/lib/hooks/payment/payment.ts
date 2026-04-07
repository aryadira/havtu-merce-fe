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

export const useUploadEvidence = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, file }: { orderId: string; file: File }) =>
            payment.uploadEvidence(orderId, file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.details(data.order_id) });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useVerifyEvidence = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            orderId,
            data,
        }: {
            orderId: string;
            data: { action: string; verification_note?: string };
        }) => payment.verifyEvidence(orderId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.details(data.order_id) });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};
