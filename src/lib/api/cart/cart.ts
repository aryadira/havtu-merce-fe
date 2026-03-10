import api from '@/src/lib/axios';
import { Cart } from '@/src/types/product';

export interface AddToCartDTO {
    user_id?: string;
    product_id: string;
    item_qty: number;
    session_id?: string;
}

export interface UpdateCartDTO {
    item_id: string;
    item_qty: number;
}

export const carts = {
    CARTS_URL: '/carts',

    async getCarts(): Promise<Cart> {
        const response = await api.get(this.CARTS_URL);
        return response.data;
    },

    async addToCart(data: AddToCartDTO) {
        const response = await api.post(this.CARTS_URL, data);
        return response.data;
    },

    async updateCartItem(data: UpdateCartDTO) {
        const response = await api.patch(`${this.CARTS_URL}/${data.item_id}`, data);
        return response.data;
    },

    async removeCartItem(id: string) {
        const response = await api.delete(`${this.CARTS_URL}/${id}`);
        return response.data;
    },
};
