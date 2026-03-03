import api from '../../axios';
import { Pagination } from '@/src/types/pagination';
import { ProductDetailResponse, ProductShop, ProductCategory } from '@/src/types/product';

export const productShop = {
    PRODUCT_SHOP_URL: '/products/shop',

    async getProducts(pagination: Partial<Pagination>) {
        const response = await api.get<ProductShop>(this.PRODUCT_SHOP_URL, {
            params: pagination,
        });
        return response.data;
    },

    async getProductDetails(id: string) {
        const response = await api.get<ProductDetailResponse>(`${this.PRODUCT_SHOP_URL}/${id}`);
        return response.data;
    },

    async getCategories() {
        const response = await api.get<ProductCategory[]>(`${this.PRODUCT_SHOP_URL}/categories`);
        return response.data;
    },
};
