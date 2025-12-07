export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentProof?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}
