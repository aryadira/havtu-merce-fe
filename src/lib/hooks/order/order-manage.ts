import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pagination } from '@/src/types/pagination';
import { orderManage } from '../../api/order/order-manage';

const orderManageKey = {
    key: ['order-manage'] as const,
    lists: () => [...orderManageKey.key, 'orders-manage'] as const,
    page: (pagination: Pagination) => [...orderManageKey.lists(), pagination] as const,
};

export const useManageOrders = (pagination: Pagination) => {
    return useQuery({
        queryKey: orderManageKey.page(pagination),
        queryFn: () => orderManage.getOrdersManage(pagination),
    });
};
