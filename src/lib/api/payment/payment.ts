import api from '@/src/lib/axios';

export const payment = {
    PAYMENT_URL: '/payments',

    async pay(orderId: string): Promise<any> {
        const response = await api.post(`${this.PAYMENT_URL}/pay/${orderId}`);
        return response.data;
    },
};
