import { Meta } from '@/src/types/meta';
import { ProductShop } from '@/src/types/product';
import { Cart } from './cart';
import { ShippingAddress, ShippingInfo } from './shipping';

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