"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/product/product-card";
import { useGetProductsShop } from "@/src/lib/api/products/shop/get-products.shop";
import { usePagination } from "@/src/hooks/use-pagination";

export default function page() {
  const { page, limit, next, prev } = usePagination();
  const { data: products, isLoading: loadProducts } = useGetProductsShop(
    page,
    limit
  );

  const productData = products?.data || [];
  const meta = products?.meta;

  console.log("products", products);

  return (
    <section className="container py-12">
      <div className="mb-10 slide-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Products
        </h1>
        <p className="text-sm text-muted-foreground">
          Curated selection of minimal essentials
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.data.map((product, index) => (
          <div
            key={product.id}
            className="fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {meta?.currentPage} of {meta?.totalPages} — showing{" "}
          {meta?.itemCount} items out of {meta?.totalItems}.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => prev(meta)}
            disabled={!meta?.hasPreviousPage}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => next(meta)}
            disabled={!meta?.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>

      {products?.data && productData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      )}
    </section>
  );
}
