"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

import { useLogin } from "@/src/lib/api/auth/login";
import { z } from "zod";

import { loginSchema } from "./schema";

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema) as Resolver<LoginSchema>,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Login berhasil!");
        router.push("/products/manage");
      },
      onError: (error: any) => {
        const { message } = error?.response?.data;
        toast.error(message);
      },
    },
  });

  const handleLogin = async (data: LoginSchema) => {
    login(data);
  };

  return (
    <main className="w-full flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Login
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
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
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
