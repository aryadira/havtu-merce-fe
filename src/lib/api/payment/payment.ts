import api from '@/src/lib/axios';

export const payment = {
    PAYMENT_URL: '/payments',

    async pay(orderId: string): Promise<any> {
        const response = await api.post(`${this.PAYMENT_URL}/pay/${orderId}`);
        return response.data;
    },

    async uploadEvidence(orderId: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('evidence', file);
        const response = await api.post(`${this.PAYMENT_URL}/evidence/${orderId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async verifyEvidence(orderId: string, data: { action: string; verification_note?: string }): Promise<any> {
        const response = await api.patch(`${this.PAYMENT_URL}/verify/${orderId}`, data);
        return response.data;
    },
};
