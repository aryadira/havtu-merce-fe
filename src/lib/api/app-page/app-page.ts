import api from '@/src/lib/axios';
import { AppPage, CreateAppPageDto, UpdateAppPageDto } from '@/src/types/app-page';

export const appPageApi = {
    APP_PAGE_URL: '/app-pages',

    async findAll(): Promise<AppPage[]> {
        const response = await api.get(this.APP_PAGE_URL);
        return response.data;
    },

    async findOne(id: string): Promise<AppPage> {
        const response = await api.get(`${this.APP_PAGE_URL}/${id}`);
        return response.data;
    },

    async create(data: CreateAppPageDto): Promise<AppPage> {
        const response = await api.post(this.APP_PAGE_URL, data);
        return response.data;
    },

    async update(id: string, data: UpdateAppPageDto): Promise<AppPage> {
        const response = await api.patch(`${this.APP_PAGE_URL}/${id}`, data);
        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${this.APP_PAGE_URL}/${id}`);
    },
};
