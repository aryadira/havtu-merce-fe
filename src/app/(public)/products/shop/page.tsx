"use client";

import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/product/product-card";
import { useGetProductsShop } from "@/src/lib/api/products";
import { usePagination } from "@/src/hooks/use-pagination";
import { Skeleton } from "@/src/components/ui/skeleton";
import { PackageX } from "lucide-react";

import React from "react";

export const dynamic = "force-dynamic";

function ShopPageContent() {
  const { page, limit, next, prev } = usePagination();
  const { data: products, isLoading: loadProducts } = useGetProductsShop(
    page,
    limit
  );
  const productData = products?.data || [];
  const meta = products?.meta;

  // Loading state
  if (loadProducts) {
    return (
      <section className="container py-12">
        <ProductHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Image Skeleton */}
              <Skeleton className="aspect-square w-full rounded-lg" />
              {/* Content Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (productData.length === 0) {
    return (
      <section className="container py-12">
        <ProductHeader />

        <div className="flex flex-col items-center justify-center py-20 text-center slide-up">
          <div className="bg-muted rounded-full p-4 mb-4">
            <PackageX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h2>
          <p className="text-muted-foreground max-w-sm">
            We couldn't find any products at the moment. Please check back
            later.
          </p>
        </div>
      </section>
    );
  }

  // Normal state
  return (
    <section className="container py-12">
      <ProductHeader />

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.map((product, index) => (
          <div
            key={product.id}
            className="fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 mt-8">
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
    </section>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense fallback={<Skeleton className="w-full h-96" />}>
      <ShopPageContent />
    </React.Suspense>
  );
}

const ProductHeader = () => (
  <div className="mb-10 slide-up">
    <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
      Products
    </h1>
    <p className="text-sm text-muted-foreground">
      Curated selection of minimal essentials
    </p>
  </div>
);
