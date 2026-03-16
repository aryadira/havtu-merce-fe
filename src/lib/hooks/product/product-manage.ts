import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productManage } from '../../api/product/product-manage';
import { Pagination } from '@/src/types/pagination';
import { CreateProductSchema } from '@/src/app/(admin)/products/schema';
import { ProductManageListResponse } from '@/src/types/product';

const productKeys = {
    key: ['product-manage'] as const,
    lists: () => [...productKeys.key, 'lists'] as const,
    page: (pagination: Pagination) => [...productKeys.lists(), pagination] as const,
    item: () => [...productKeys.key, 'item'] as const,
    details: (id: string | undefined) => [...productKeys.item(), id] as const,
};

export const useProductManageList = <T extends ProductManageListResponse>(
    pagination: Pagination,
    select?: (data: ProductManageListResponse) => T,
) => {
    return useQuery({
        queryKey: productKeys.page(pagination),
        queryFn: () => productManage.getProducts(pagination),
        select,
    });
};

export const useProductDetails = (id: string | undefined) => {
    return useQuery({
        queryKey: productKeys.details(id),
        queryFn: () => productManage.getProductDetails(id),
        enabled: !!id,
    });
};

export const useCreateProduct = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: CreateProductSchema) => productManage.createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.lists(),
            });
            options?.onSuccess?.();
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
};

export const useUpdateProduct = (
    id: string | undefined,
    options?: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
    },
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: CreateProductSchema) => productManage.updateProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.details(id),
            });
            options?.onSuccess?.();
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
};

export const useDeleteProduct = (
    id: string | undefined,
    options?: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
    },
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => productManage.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.lists(),
            });
            options?.onSuccess?.();
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
};
