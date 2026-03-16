import { useQuery } from '@tanstack/react-query';
import { productShop } from '../../api/product/product-shop';
import { Pagination } from '@/src/types/pagination';

const productShopKeys = {
    key: ['product-shop'] as const,
    categories: () => [...productShopKeys.key, 'categories'] as const,
    lists: () => [...productShopKeys.key, 'lists'] as const,
    page: (pagination: Pagination) => [...productShopKeys.lists(), pagination] as const,
    item: () => [...productShopKeys.key, 'item'] as const,
    details: (id: string | undefined) => [...productShopKeys.item(), id] as const,
};

export const useProductShopList = (pagination: Pagination) => {
    return useQuery({
        queryKey: productShopKeys.page(pagination),
        queryFn: () => productShop.getProducts(pagination),
    });
};

export const useProductShopDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: productShopKeys.details(id),
        queryFn: () => productShop.getProductDetails(id),
        enabled: !!id,
    });
};

export const useProductCategories = () => {
    return useQuery({
        queryKey: productShopKeys.categories(),
        queryFn: () => productShop.getCategories(),
    });
};
