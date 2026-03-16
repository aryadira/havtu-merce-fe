import { useQuery } from "@tanstack/react-query"
import { userPaymentMethod } from "../../api/user/user-payment-method"

const userPaymentMethodKeys = {
    key: ['user-payment-method'] as const,
    lists: () => [...userPaymentMethodKeys.key, 'lists'] as const,
}

export const useUserPaymentMethods = () => {
    return useQuery({
        queryKey: userPaymentMethodKeys.lists(),
        queryFn: () => userPaymentMethod.getPaymentMethods(),
    })
}