import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shop, CreateShopDto } from '../../api/shop/shop';

export const useOpenShop = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateShopDto) => shop.openShop(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (options?.onSuccess) {
                options.onSuccess(data);
            }
        },
        onError: (error: any) => {
            if (options?.onError) {
                options.onError(error);
            }
        },
    });
};
