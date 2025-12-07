"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { products } from "@/src/data/products";
import { ProductCard } from "@/src/components/product/product-cart";

const categories = [
  "All",
  "Electronics",
  "Lighting",
  "Home",
  "Office",
  "Accessories",
];

export default function page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

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

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8 fade-in">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      )}
    </section>
  );
}
