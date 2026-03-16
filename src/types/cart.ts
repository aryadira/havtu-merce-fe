import { ProductShop } from "./product";

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

export interface AddToCartDto {
    user_id?: string;
    product_id: string;
    item_qty: number;
    session_id?: string;
}

export interface UpdateCartDto {
    item_id: string;
    item_qty: number;
}