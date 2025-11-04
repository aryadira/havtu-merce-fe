export interface Product {
  id: number;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
