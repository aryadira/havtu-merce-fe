import { useQuery } from '@tanstack/react-query';
import { productShop } from '../../api/product/product-shop';

export const useProductShop = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['products-shop', page, limit],
        queryFn: () => productShop.getProducts({ page, limit }),
    });
};

export const useProductShopDetail = (id: string) => {
    return useQuery({
        queryKey: ['product-shop', id],
        queryFn: () => productShop.getProductDetails(id),
    });
};

export const useProductCategories = () => {
    return useQuery({
        queryKey: ['product-shop-categories'],
        queryFn: () => productShop.getCategories(),
    });
};
