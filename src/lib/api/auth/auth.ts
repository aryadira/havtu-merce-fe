import { LoginSchema } from '@/src/app/(auth)/login/schema';
import { RegisterSchema } from '@/src/app/(auth)/register/schema';
import api from '@/src/lib/axios';
import { useAuthStore } from '@/src/stores/auth.store';
import { CurrentUserResponse } from '@/src/types/auth';

export const auth = {   
    AUTH_URL: '/auth',

    async login(data: LoginSchema) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        const res = await api.post(`${this.AUTH_URL}/login`, data);
        const { token, refreshToken } = res.data;
        useAuthStore.getState().setTokens(token, refreshToken);
        return res.data;
    },

    async register(data: RegisterSchema) {
        const response = await api.post(`${this.AUTH_URL}/register`, data);
        return response.data;
    },

    async logout(): Promise<boolean> {
        try {
            await api.post(`${this.AUTH_URL}/logout`);
        } catch (err) {
            console.warn('Logout API not implemented:', err);
        }
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        document.cookie = 'token=; Max-Age=0; path=/;';
        document.cookie = 'refreshToken=; Max-Age=0; path=/;';
        delete api.defaults.headers.common['Authorization'];
        return true;
    },

    async me(): Promise<CurrentUserResponse> {
        const response = await api.get<CurrentUserResponse>(`${this.AUTH_URL}/me`);
        return response.data;
    },
};
