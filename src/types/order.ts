import { Meta } from '@/src/types/meta';
import { ProductShop } from '@/src/types/product';
import { Cart } from './cart';
import { ShippingAddress, ShippingInfo } from './shipping';
import { ProductItem } from './product';

// export enum OrderStatus {
//     PENDING = 'PENDING',
//     COMPLETED = 'COMPLETED',
//     CANCELLED = 'CANCELLED',
// }

// export enum PaymentStatus {
//     UNPAID = 'UNPAID',
//     PAID = 'PAID',
//     FAILED = 'FAILED',
// }

export interface Order {
    id: string;
    items: Cart[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: string;
    paymentProof?: string;
    status: OrderStatus;
    createdAt: Date;
}

export interface OrderStatus {
    id: string;
    label: string;
    slug: string;
    abbreviation: string;
    description: string;
}

export interface PaymentStatus {
    id: string;
    label: string;
    slug: string;
    abbreviation: string;
    description: string;
}

export interface OrderResponse {
    id: string;
    user_id: string;
    order_number: string;
    order_status_id: string;
    payment_status_id: string;
    user_payment_method_id: string;
    order_total: string;
    shipping_method_id: string;
    shipping_address: string;
    order_lines: OrderItemResponse[];
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    updated_at: string;
}

export interface OrderItemResponse {
    id: string;
    order_id: string;
    product_item_id: string;
    qty: number;
    price: string;
    created_at: string;
    updated_at: string;
    product_item: ProductItem;
}

export interface OrderListResponse {
    data: OrderResponse[];
    meta: Meta;
}

export type CheckoutOrderDto = {
    items?: CheckoutItemDto[];
    shipping_address: ShippingAddress;
    user_payment_method_id: string;
    shipping_method_id: string;
};

export type CheckoutItemDto = {
    product_id: string;
    qty_in_stock: number;
};
