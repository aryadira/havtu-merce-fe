import api from '@/src/lib/axios';
import { Bank } from '@/src/types/bank';

export const bank = {
    BANK_URL: '/banks',

    async getBanks(): Promise<Bank[]> {
        const response = await api.get(this.BANK_URL);
        return response.data;
    },
};
