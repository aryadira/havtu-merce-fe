import { z } from "zod";

export const createProductSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
