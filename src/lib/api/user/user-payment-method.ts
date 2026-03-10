import api from '../../axios';

export const userPaymentMethod = {
    USER_PAYMENT_METHOD_URL: '/users/payment-methods',

    async getPaymentMethods() {
        const response = await api.get(this.USER_PAYMENT_METHOD_URL);
        return response.data;
    },
};
