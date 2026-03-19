import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userRoleApi } from '../../api/user-role';
import { UpdateUserRolePermissionsDto } from '@/src/types/user-role';

const userRoleKeys = {
    all: ['user-roles'] as const,
    list: () => [...userRoleKeys.all, 'list'] as const,
};

export const useUserRoles = () => {
    return useQuery({
        queryKey: userRoleKeys.list(),
        queryFn: () => userRoleApi.findAll(),
    });
};

export const useUpdateUserRolePermissions = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRolePermissionsDto }) =>
            userRoleApi.updatePermissions(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userRoleKeys.list() });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};
