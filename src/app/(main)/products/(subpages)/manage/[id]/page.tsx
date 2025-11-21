"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetProduct } from "@/src/lib/api/product/manage/get-product.manage";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const { id } = useParams();

  const {
    data: product,
    isLoading: loadProduct,
    isError: errorProduct,
  } = useGetProduct({
    id: id as string,
    queryConfig: {
      enabled: !!id,
    },
  });

  if (loadProduct) {
    return <p className="p-5">Loading...</p>;
  }

  if (errorProduct || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Product not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card className="overflow-hidden shadow-md border border-gray-100">
        <CardHeader className="bg-gray-50 pb-4">
          <CardTitle className="text-2xl font-semibold">
            {product.name}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {product.description || "No description available."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-72 object-cover rounded-md"
            />
          )} */}

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p className="text-gray-500">Price:</p>
            <p className="font-semibold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price || 0)}
            </p>

            <p className="text-gray-500">Stock:</p>
            <p className="font-medium">{product.stock ?? "N/A"}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-4 gap-5">
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {product.updated_at
              ? new Date(product.updated_at).toLocaleDateString("id-ID")
              : "-"}
          </p>
          <Button className="cursor-pointer">Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
