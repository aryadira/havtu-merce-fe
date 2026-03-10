import { useQuery } from '@tanstack/react-query';
import { shippingMethod } from '../../api/shipping-method/shipping-method';

export const getShippingMethodsQueryKey = () => ['shipping-methods'];

export const useGetShippingMethods = () => {
    return useQuery({
        queryKey: getShippingMethodsQueryKey(),
        queryFn: () => shippingMethod.getShippingMethods(),
    });
};
