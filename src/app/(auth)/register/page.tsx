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

import { register, useRegister } from "@/src/lib/api/auth";
import { registerSchema, type RegisterSchema } from "./schema";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterSchema>,
    defaultValues: {
      fullname: "",
      email: "",
      phone_number: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate: register, isPending } = useRegister({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Akun berhasil dibuat!");
        router.push("/login");
      },
      onError: (error: any) => {
        const { message } = error?.response?.data;
        toast.error(message);
      },
    },
  });

  const handleRegister = async (data: RegisterSchema) => {
    register(data);
  };

  return (
    <main className="w-full flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Register
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input
                      type="fullname"
                      placeholder="Masukkan Nama Lengkap"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Gunakan nama lengkap sesuai.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="phone_number"
                      placeholder="Masukkan nomor telepon"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Gunakan nomor telepon terdaftar.
                  </FormDescription>
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Confirm</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan Konfirmasi Password"
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
              {isPending ? "Creating Account..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
