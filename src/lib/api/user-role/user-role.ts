import api from '@/src/lib/axios';
import { UserRole, UpdateUserRolePermissionsDto } from '@/src/types/user-role';

export const userRoleApi = {
    USER_ROLE_URL: '/user-roles',

    async findAll(): Promise<UserRole[]> {
        const response = await api.get(this.USER_ROLE_URL);
        return response.data;
    },

    async updatePermissions(id: string, data: UpdateUserRolePermissionsDto): Promise<UserRole> {
        const response = await api.patch(`${this.USER_ROLE_URL}/${id}/permissions`, data);
        return response.data;
    },
};
