import api from '@/src/lib/axios';
import { OrderListResponse, OrderResponse, CheckoutOrderDto } from '@/src/types/order';
import { Pagination } from '@/src/types/pagination';

export const orders = {
    ORDERS_URL: '/orders',

    async getOrders(pagination: Pagination): Promise<OrderListResponse> {
        const response = await api.get(this.ORDERS_URL, { params: pagination });
        return response.data;
    },

    async getOrdersManage(pagination: Pagination): Promise<OrderListResponse> {
        const response = await api.get(this.ORDERS_URL, { params: pagination });
        return response.data;
    },

    async getOrder(id: string | undefined): Promise<OrderResponse> {
        const response = await api.get(`${this.ORDERS_URL}/${id}`);
        return response.data;
    },

    async checkout(data: CheckoutOrderDto) {
        const response = await api.post(`${this.ORDERS_URL}/checkout`, data);
        return response.data;
    }
};
