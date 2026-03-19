'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/src/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';

import { useLogin, useMe } from '@/src/lib/hooks/auth';
import { z } from 'zod';
import { loginSchema } from './schema';

import Link from 'next/link';
import { handleApiError } from '@/src/lib/api-utils';

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [loginMode, setLoginMode] = useState<'buyer' | 'seller'>('buyer');
    const { refetch } = useMe();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema) as Resolver<LoginSchema>,
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { mutate: login, isPending } = useLogin({
        onSuccess: async () => {
            setIsRedirecting(true);
            try {
                const redirectUser = await refetch().then((res) => res.data);
                
                if (loginMode === 'seller') {
                    if (redirectUser?.role_slug === 'seller') {
                        toast.success('Login berhasil sebagai Seller!');
                        router.push('/products/manage');
                    } else {
                        setIsRedirecting(false);
                        toast.error('Akun anda belum terdaftar sebagai Seller. Silakan login sebagai Buyer dan daftar di profil.');
                    }
                } else {
                    toast.success('Login berhasil!');
                    router.push('/products/shop');
                }
            } catch (error) {
                console.error('Redirect error:', error);
                setIsRedirecting(false);
            }
        },
        onError: (error: any) => {
            setIsRedirecting(false);
            handleApiError(error);
        },
    });

    const onClickLogin = (mode: 'buyer' | 'seller') => {
        setLoginMode(mode);
        form.handleSubmit((data) => login(data))();
    };

    return (
        <main className="w-full flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login</h1>
                <Form {...form}>
                    <form className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Masukkan email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Gunakan email terdaftar.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Masukkan password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Minimal 6 karakter.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            Belum punya akun?{' '}
                            <span className="hover:underline text-primary">
                                <Link href="/register">Register</Link>
                            </span>
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            <Button
                                type="button"
                                onClick={() => onClickLogin('buyer')}
                                className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white"
                                disabled={isPending || isRedirecting}
                            >
                                {isPending && loginMode === 'buyer' 
                                    ? 'Loading...' 
                                    : isRedirecting && loginMode === 'buyer' 
                                    ? 'Redirecting...' 
                                    : 'Login as a Buyer'}
                            </Button>
                            
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onClickLogin('seller')}
                                className="cursor-pointer border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                disabled={isPending || isRedirecting}
                            >
                                {isPending && loginMode === 'seller' 
                                    ? 'Loading...' 
                                    : isRedirecting && loginMode === 'seller' 
                                    ? 'Redirecting...' 
                                    : 'Login as a Seller'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
