import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productManage } from '../../api/product/product-manage';
import { Pagination } from '@/src/types/pagination';
import { CreateProductSchema } from '@/src/app/(admin)/products/schema';
import { ManageProductListResponse } from '@/src/types/product';

export const useProductManageList = <T extends ManageProductListResponse>(
    pagination: Pagination,
    select?: (data: ManageProductListResponse) => T,
) => {
    return useQuery({
        queryKey: ['product-manage', pagination],
        queryFn: () => productManage.getProducts(pagination),
        select,
    });
};

export const useProductDetails = (id: string | undefined) => {
    return useQuery({
        queryKey: ['product-manage-details', id],
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
                queryKey: ['product-manage'],
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
                queryKey: ['product-manage-details', id],
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
                queryKey: ['product-manage', id],
            });
            options?.onSuccess?.();
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
};
