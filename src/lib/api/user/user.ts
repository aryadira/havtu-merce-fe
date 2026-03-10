import api from '@/src/lib/axios';
import { ProfileSchema } from '@/src/app/(public)/profile/schema';

export const user = {
    USER_URL: '/users',

    async getProfile() {
        const response = await api.get(`${this.USER_URL}/profile`);
        return response.data;
    },

    async updateProfile(data: ProfileSchema) {
        const response = await api.put(`${this.USER_URL}/profile`, data);
        return response.data;
    },

    async updateUser({ id, data }: { id: string; data: ProfileSchema }) {
        const response = await api.put(`${this.USER_URL}`, data);
        return response.data;
    },

    async createAddress(data: any) {
        const response = await api.post(`${this.USER_URL}/addresses`, data);
        return response.data;
    },
};
