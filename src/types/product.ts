export interface ProductManage {
  id: string;
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

export interface ProductShop {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface Cart {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  session_id: string | null;
  cart_items: CartItem[];
}

export interface CartItem {
  item_id: string;
  cart_id: string;
  product_id: string;
  item_qty: number;
  created_at: string;
  updated_at: string;
  product: ProductShop;
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
  items: Cart[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentProof?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}
