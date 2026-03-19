import { useQuery } from '@tanstack/react-query';
import { paymentType } from '../../api/payment/payment-type';

const paymentTypeKeys = {
    key: ['payment-type'] as const,
    lists: () => [...paymentTypeKeys.key, 'lists'] as const,
};

export const usePaymentTypes = () => {
    return useQuery({
        queryKey: paymentTypeKeys.lists(),
        queryFn: () => paymentType.getPaymentTypes(),
    });
};
