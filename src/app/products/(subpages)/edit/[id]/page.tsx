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
import { useGetProductDetail } from "@/src/lib/api/product/getProductDetail";
import { useUpdateProduct } from "@/src/lib/api/product/updateProduct";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProductSchema, type CreateProductSchema } from "../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductSchema>,
    defaultValues: {
      user_id: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      image_url: "",
      is_active: true,
    },
  });

  const { data: product, isLoading: loadProduct } = useGetProductDetail({
    id: productId,
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  const { mutate: updateProduct, isPending } = useUpdateProduct({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Product updated.");
        router.push("/products");
      },
    },
  });

  const handleUpdate = (products: CreateProductSchema) => {
    updateProduct({
      id: productId as string,
      products,
    });
  };

  if (loadProduct) return <p className="p-5">Loading...</p>;

  return (
    <main className="w-full p-5">
      <h1 className="text-2xl">Edit Product</h1>
      <div className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
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
                    <Input type="number" placeholder="Stock" {...field} />
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
                    <Textarea className="h-24" {...field} />
                  </FormControl>
                  <FormDescription>Product description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
