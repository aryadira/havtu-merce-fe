import { useQuery } from "@tanstack/react-query"
import { userPaymentMethod } from "../../api/user/user-payment-method"

export const useUserPaymentMethods = () => {
    return useQuery({
        queryKey: ['user-payment-methods'],
        queryFn: () => userPaymentMethod.getPaymentMethods(),
    })
}