"use client";

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
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateProduct } from "@/src/lib/api/product/manage/create-product.manage";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProductSchema, type CreateProductSchema } from "../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductSchema>,
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      is_active: true,
    },
  });

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Product created.");
        form.reset();
        router.push("/products/manage");
      },
      onError: (error: any) => {
        const { message } = error?.response?.data;
        toast.error(message);
      },
    },
  });

  const handleCreateProduct = (data: CreateProductSchema) => {
    createProduct(data);
  };

  if (isCreating) return <p>Loading...</p>;

  return (
    <main className="w-full">
      <h1 className="text-2xl">Create Product</h1>
      <div id="create-product-form" className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateProduct)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Product name must be filled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product Price"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Product price must be filled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Stock" {...field} />
                  </FormControl>
                  <FormDescription>Stock must be filled.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write description of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
