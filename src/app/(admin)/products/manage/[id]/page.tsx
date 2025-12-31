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
import { useGetProduct } from "@/src/lib/api/products/manage/get-product.manage";
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
    <div className="max-w-4xl mx-auto mt-10 pb-20">
      <Card className="overflow-hidden shadow-md border border-gray-100">
        <CardHeader className="bg-gray-50 pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-semibold">
                  {product.name}
                </CardTitle>
                <div
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    product.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <CardDescription className="text-gray-500">
                {product.category.category_name}
              </CardDescription>
            </div>
            <p className="text-sm text-gray-500">
              ID: <span className="font-mono text-xs">{product.id}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {/* Images Section */}
          {product.images && product.images.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Images</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="shrink-0 w-48 h-32 rounded-md overflow-hidden border"
                  >
                    <img
                      src={img.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Description</p>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Variants / Items Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Product Items (SKUs)</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-4">Variation / SKU</div>
                <div className="col-span-4">Configuration</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Stock</div>
              </div>
              <div className="divide-y">
                {product.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 p-3 text-sm items-center hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="col-span-4 flex flex-col">
                      <span className="font-medium text-gray-900">
                        {item.sku}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {item.id}
                      </span>
                    </div>
                    <div className="col-span-4 space-y-1">
                      {item.configurations.map((config) => (
                        <div
                          key={config.product_variation_option_id}
                          className="flex gap-2"
                        >
                          <span className="text-gray-500 text-xs uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
                            {
                              config.product_variation_option.variation
                                .variation_name
                            }
                          </span>
                          <span>{config.product_variation_option.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </div>
                    <div className="col-span-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.qty_in_stock > 0
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.qty_in_stock} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 flex justify-between items-center border-t py-4 px-6 text-xs text-gray-500">
          <div>
            Created:{" "}
            {new Date(product.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div>
            Updated:{" "}
            {new Date(product.updated_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button>Edit Product</Button>
      </div>
    </div>
  );
}
