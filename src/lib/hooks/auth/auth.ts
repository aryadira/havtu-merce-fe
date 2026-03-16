import { LoginSchema } from '@/src/app/(auth)/login/schema';
import { RegisterSchema } from '@/src/app/(auth)/register/schema';
import { useAuthStore } from '@/src/stores/auth.store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { auth } from '../../api/auth/auth';

const authKeys = {
    key: ['auth'] as const,
    user: () => [...authKeys.key, 'user'] as const,
};

export const useMe = () => {
    return useQuery({
        queryKey: authKeys.user(),
        queryFn: () => auth.me(),
    });
};

export const useLogin = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginSchema) => auth.login(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useRegister = (options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterSchema) => auth.register(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
            options?.onSuccess?.(data);
        },
        onError: (error) => options?.onError?.(error),
    });
};

export const useLogout = (options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => auth.logout(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authKeys.user() });
            router.push('/login');
            options?.onSuccess?.();
        },
        onError: (error) => options?.onError?.(error),
    });
};

export function useAuth() {
    const { token, refreshToken, setTokens, clearAuth } = useAuthStore();
    return { token, refreshToken, setTokens, clearAuth };
}
