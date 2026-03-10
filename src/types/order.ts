import { Meta } from '@/src/types/meta';
import { ProductShop } from '@/src/types/product';

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export interface OrderItemResponse {
    id: string;
    order_id: string;
    product_id: string;
    item_qty: number;
    item_price: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    product: ProductShop;
}

export interface OrderResponse {
    id: string;
    user_id: string;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    created_at: string;
    updated_at: string;
    order_lines: OrderItemResponse[];
}

export interface OrdersListResponse {
    data: OrderResponse[];
    meta: Meta;
}

export type CheckoutItemDto = {
    product_id: string;
    qty_in_stock: number;
};

export type ShippingAddressDto = {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};

export type CheckoutOrderDto = {
    items?: CheckoutItemDto[];
    shipping_address: ShippingAddressDto;
    user_payment_method_id: string;
    shipping_method_id: string;
};
