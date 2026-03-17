import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userPaymentMethod } from '../../api/user/user-payment-method';

const userPaymentMethodKeys = {
    key: ['user-payment-method'] as const,
    lists: () => [...userPaymentMethodKeys.key, 'lists'] as const,
};

export const useUserPaymentMethods = () => {
    return useQuery({
        queryKey: userPaymentMethodKeys.lists(),
        queryFn: () => userPaymentMethod.getPaymentMethods(),
    });
};

export const useCreatePaymentMethod = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => userPaymentMethod.createPaymentMethod(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userPaymentMethodKeys.lists() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};
