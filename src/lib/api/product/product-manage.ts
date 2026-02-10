import api from '../../axios';
import { ManageProductListResponse, ProductDetailResponse } from '@/src/types/product';
import { CreateProductSchema } from '@/src/app/(admin)/products/schema';
import { Pagination } from '@/src/types/pagination';

export const productManage = {
    PRODUCT_MANAGE_URL: '/products/manage',

    async getProducts(pagination: Partial<Pagination>) {
        const response = await api.get<ManageProductListResponse>(this.PRODUCT_MANAGE_URL, {
            params: pagination,
        });
        return response.data;
    },

    async getProductDetails(id: string | undefined) {
        const response = await api.get<ProductDetailResponse>(`${this.PRODUCT_MANAGE_URL}/${id}`);
        return response.data;
    },

    async createProduct(product: CreateProductSchema) {
        const response = await api.post<ProductDetailResponse>(this.PRODUCT_MANAGE_URL, product);
        return response.data;
    },

    async updateProduct(id: string | undefined, product: CreateProductSchema) {
        const response = await api.patch<ProductDetailResponse>(
            `${this.PRODUCT_MANAGE_URL}/${id}`,
            product,
        );
        return response.data;
    },

    async deleteProduct(id: string | undefined) {
        const response = await api.delete(`${this.PRODUCT_MANAGE_URL}/${id}`);
        return response.data;
    },
};
