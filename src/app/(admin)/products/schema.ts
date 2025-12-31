import { z } from "zod";

export const productVariationSchema = z.object({
  name: z.string().min(1, "Variation name is required"),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "Option value is required"),
      })
    )
    .min(1, "At least one option is required"),
});

export const productItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  qty_in_stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  configurations: z.array(
    z.object({
      variation_name: z.string(),
      option_value: z.string(),
    })
  ),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  product_category_id: z.string().uuid("Category is required"),
  is_active: z.boolean().default(true),
  images: z.array(z.string().url("Invalid URL")).optional(),
  variations: z.array(productVariationSchema).default([]),
  items: z
    .array(productItemSchema)
    .min(1, "At least one product item is required"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type ProductVariation = z.infer<typeof productVariationSchema>;
export type ProductItem = z.infer<typeof productItemSchema>;
