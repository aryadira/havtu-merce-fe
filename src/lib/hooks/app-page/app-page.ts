import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appPageApi } from '../../api/app-page';
import { CreateAppPageDto, UpdateAppPageDto } from '@/src/types/app-page';

const appPageKeys = {
    all: ['app-pages'] as const,
    list: () => [...appPageKeys.all, 'list'] as const,
    details: () => [...appPageKeys.all, 'detail'] as const,
    detail: (id: string) => [...appPageKeys.details(), id] as const,
};

export const useAppPages = () => {
    return useQuery({
        queryKey: appPageKeys.list(),
        queryFn: () => appPageApi.findAll(),
    });
};

export const useAppPage = (id: string) => {
    return useQuery({
        queryKey: appPageKeys.detail(id),
        queryFn: () => appPageApi.findOne(id),
        enabled: !!id,
    });
};

export const useCreateAppPage = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAppPageDto) => appPageApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appPageKeys.list() });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};

export const useUpdateAppPage = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAppPageDto }) =>
            appPageApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: appPageKeys.list() });
            queryClient.invalidateQueries({ queryKey: appPageKeys.detail(variables.id) });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};

export const useDeleteAppPage = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => appPageApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appPageKeys.list() });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};
