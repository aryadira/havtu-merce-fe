import { useQuery } from '@tanstack/react-query';
import { productShop } from '../../api/product/product-shop';

export const useProductCategories = () => {
    return useQuery({
        queryKey: ['product-shop-categories'],
        queryFn: () => productShop.getCategories(),
    });
};
