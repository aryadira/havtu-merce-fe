import { useQuery } from '@tanstack/react-query';
import { shippingMethod } from '../../api/shipping-method/shipping-method';

const shippingMethodKeys = {
    key: ['shipping-method'] as const,
    lists: () => [...shippingMethodKeys.key, 'lists'] as const,
}

export const useShippingMethods = () => {
    return useQuery({
        queryKey: shippingMethodKeys.lists(),
        queryFn: () => shippingMethod.getShippingMethods(),
    });
};
