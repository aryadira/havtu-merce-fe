import api from '@/src/lib/axios';
import { Cart, AddToCartDto, UpdateCartDto } from '@/src/types/cart';

export const carts = {
    CARTS_URL: '/carts',

    async getCarts(): Promise<Cart> {
        const response = await api.get(this.CARTS_URL);
        return response.data;
    },

    async addToCart(data: AddToCartDto) {
        const response = await api.post(this.CARTS_URL, data);
        return response.data;
    },

    async updateCartItem(data: UpdateCartDto) {
        const response = await api.patch(`${this.CARTS_URL}/${data.item_id}`, data);
        return response.data;
    },

    async removeCartItem(id: string) {
        const response = await api.delete(`${this.CARTS_URL}/${id}`);
        return response.data;
    },
};
