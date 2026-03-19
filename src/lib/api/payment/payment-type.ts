import api from '@/src/lib/axios';
import { PaymentType } from '@/src/types/payment-type';

export const paymentType = {
    PAYMENT_TYPE_URL: '/payment-types',

    async getPaymentTypes(): Promise<PaymentType[]> {
        const response = await api.get(this.PAYMENT_TYPE_URL);
        return response.data;
    },
};
