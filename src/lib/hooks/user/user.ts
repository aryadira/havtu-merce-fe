import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from '../../api/user/user';
import { ProfileSchema } from '@/src/app/(public)/profile/schema';

export const getProfileQueryKey = () => ['profile'];
export const getAuthUserQueryKey = () => ['auth-user'];

export const useGetProfile = () => {
    return useQuery({
        queryKey: getProfileQueryKey(),
        queryFn: () => user.getProfile(),
    });
};

export const useUpdateProfile = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProfileSchema) => user.updateProfile(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getProfileQueryKey() });
            queryClient.invalidateQueries({ queryKey: getAuthUserQueryKey() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useUpdateUser = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { id: string; data: ProfileSchema }) => user.updateUser(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getProfileQueryKey() });
            queryClient.invalidateQueries({ queryKey: getAuthUserQueryKey() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useCreateAddress = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => user.createAddress(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getProfileQueryKey() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};
