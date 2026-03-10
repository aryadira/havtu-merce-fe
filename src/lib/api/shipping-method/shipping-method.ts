import api from '../../axios';

export const shippingMethod = {
    SHIPPING_METHOD_URL: '/shipping-methods',

    async getShippingMethods() {
        const response = await api.get(this.SHIPPING_METHOD_URL);
        return response.data;
    },
};
