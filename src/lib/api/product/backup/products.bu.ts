import { CreateProductSchema } from '@/src/app/(admin)/products/schema';
import api from '@/src/lib/axios';
import { MutationConfig, QueryConfig, queryClient } from '@/src/lib/react-query';
import {
    ManageProductListResponse,
    ProductDetailResponse,
    ProductShop,
    ShopProductListResponse,
} from '@/src/types/product';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

// --- Query Keys ---

export const getProductsManageQueryKey = (page: number, limit: number) => [
    'products-manage',
    page,
    limit,
];
export const getProductManageQueryKey = (id: string) => ['product-manage', id];
export const getProductsShopQueryKey = (page: number, limit: number) => [
    'products-shop',
    page,
    limit,
];
export const getProductShopQueryKey = (id: string) => ['product-shop', id];

// --- Manage: Get Products ---

export const getProductsManage = async (
    page = 1,
    limit = 10,
): Promise<ManageProductListResponse> => {
    const response = await api.get('/products/manage', {
        params: { page, limit },
    });
    return response.data;
};

export const useGetProductsManage = (
    page: number,
    limit: number,
    queryConfig?: QueryConfig<typeof getProductsManageQueryOptions>,
) => {
    return useQuery({
        ...getProductsManageQueryOptions(page, limit),
        ...queryConfig,
    });
};

export const getProductsManageQueryOptions = (page: number, limit: number) => {
    return queryOptions({
        queryKey: getProductsManageQueryKey(page, limit),
        queryFn: () => getProductsManage(page, limit),
    });
};

// --- Manage: Get Product ---

export const getProductManage = async (id: string) => {
    const response = await api.get<ProductDetailResponse>(`/products/manage/${id}`);
    return response.data;
};

export const useGetProductManage = (
    id: string,
    queryConfig?: QueryConfig<typeof getProductManageQueryOptions>,
) => {
    return useQuery({
        ...getProductManageQueryOptions(id),
        ...queryConfig,
    });
};

export const getProductManageQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: getProductManageQueryKey(id),
        queryFn: () => getProductManage(id),
    });
};

// --- Manage: Create Product ---

interface UseCreateProductParams {
    mutationConfig?: MutationConfig<typeof createProduct>;
}

export const createProduct = async (products: CreateProductSchema) => {
    const response = await api.post('/products/manage', products);
    return response.data;
};

export const useCreateProduct = (params: UseCreateProductParams = {}) => {
    return useMutation({
        mutationFn: createProduct,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['products-manage'] });
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

// --- Manage: Update Product ---

interface UseUpdateProductParams {
    mutationConfig?: MutationConfig<typeof updateProduct>;
}

export const updateProduct = async ({
    id,
    products,
}: {
    id: string;
    products: CreateProductSchema;
}) => {
    const response = await api.patch(`/products/manage/${id}`, products);
    return response.data;
};

export const useUpdateProduct = (params: UseUpdateProductParams = {}) => {
    return useMutation({
        mutationFn: updateProduct,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['products-manage'] });
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

// --- Manage: Delete Product ---

interface UseDeleteProductParams {
    page: number;
    limit: number;
    mutationConfig?: MutationConfig<typeof deleteProduct>;
}

export const deleteProduct = async (id: string) => {
    const response = await api.delete(`/products/manage/${id}`);
    return response.data;
};

export const useDeleteProduct = ({ page, limit, mutationConfig }: UseDeleteProductParams) => {
    return useMutation({
        mutationFn: deleteProduct,
        ...mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({
                queryKey: getProductsManageQueryKey(page, limit),
            });
            mutationConfig?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

// --- Shop: Get Products ---

export const getProductsShop = async (page = 1, limit = 10): Promise<ShopProductListResponse> => {
    const response = await api.get('/products/shop', { params: { page, limit } });
    return response.data;
};

export const useGetProductsShop = (
    page: number,
    limit: number,
    queryConfig?: QueryConfig<typeof getProductsShopQueryOptions>,
) => {
    return useQuery({
        ...getProductsShopQueryOptions(page, limit),
        ...queryConfig,
    });
};

export const getProductsShopQueryOptions = (page: number, limit: number) => {
    return queryOptions({
        queryKey: getProductsShopQueryKey(page, limit),
        queryFn: () => getProductsShop(page, limit),
    });
};

// --- Shop: Get Product ---

export const getProductShop = async (id: string) => {
    const response = await api.get<ProductShop>(`/products/shop/${id}`);
    return response.data;
};

export const useGetProductShop = (
    id: string,
    queryConfig?: QueryConfig<typeof getProductShopQueryOptions>,
) => {
    return useQuery({
        ...getProductShopQueryOptions(id),
        ...queryConfig,
    });
};

export const getProductShopQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: getProductShopQueryKey(id),
        queryFn: () => getProductShop(id),
    });
};
