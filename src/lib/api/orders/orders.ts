import api from '@/src/lib/axios';
import { OrdersListResponse, OrderResponse, CheckoutOrderDto } from '@/src/types/order';

export const orders = {
    ORDERS_URL: '/orders',

    async getOrders(page = 1, limit = 10): Promise<OrdersListResponse> {
        const response = await api.get(this.ORDERS_URL, { params: { page, limit } });
        return response.data;
    },

    async getOrdersManage(page = 1, limit = 10): Promise<OrdersListResponse> {
        const response = await api.get(this.ORDERS_URL, { params: { page, limit } });
        return response.data;
    },

    async getOrder(orderId: string): Promise<OrderResponse> {
        const response = await api.get(`${this.ORDERS_URL}/${orderId}`);
        return response.data;
    },

    async checkout(data: CheckoutOrderDto) {
        const response = await api.post(`${this.ORDERS_URL}/checkout`, data);
        return response.data;
    },
};
