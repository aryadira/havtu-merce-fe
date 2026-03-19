import api from '@/src/lib/axios';

export interface CreateShopDto {
    shop_type: string;
    shop_name: string;
    shop_description: string;
    shop_logo?: string;
    shop_banner?: string;
    shop_address: string;
    shop_city: string;
    shop_province: string;
    shop_country: string;
    shop_postal_code: string;
    shop_phone_number?: string;
    shop_email?: string;
}

export const shop = {
    SHOP_URL: '/shop',

    async openShop(data: CreateShopDto) {
        const response = await api.post(`${this.SHOP_URL}/open`, data);
        return response.data;
    },
};
