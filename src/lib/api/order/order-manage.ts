import api from '@/src/lib/axios';
import { OrderListResponse, OrderResponse, CheckoutOrderDto } from '@/src/types/order';
import { Pagination } from '@/src/types/pagination';

export const orderManage = {
    ORDERS_URL: '/orders/manage',

    async getOrdersManage(pagination: Pagination): Promise<OrderListResponse> {
        const response = await api.get(this.ORDERS_URL, { params: pagination });
        return response.data;
    },
};
