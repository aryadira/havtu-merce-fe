import { Meta } from './meta';
import { Shop } from './shop';

export interface ProductConfiguration {
    product_item_id: string;
    product_variation_option_id: string;
    product_variation_option: {
        id: string;
        product_variation_id: string;
        value: string;
        variation: {
            id: string;
            product_category_id: string;
            variation_name: string;
            created_at: string;
            updated_at: string;
        };
        created_at: string;
        updated_at: string;
    };
}

export interface ProductItem {
    id: string;
    product_id: string;
    sku: string;
    price: number;
    qty_in_stock: number;
    configurations: ProductConfiguration[];
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: string;
    parent_category_id: string | null;
    category_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ProductDetailResponse {
    id: string;
    user_id: string;
    product_category_id: string;
    name: string;
    description: string;
    is_active: boolean;
    shop: Shop;
    items: ProductItem[];
    images: ProductImage[];
    category: ProductCategory;
    variations: ProductVariation[];
    created_at: string;
    updated_at: string;
}

export interface ProductItemResponse {
    id: string;
    name: string;
    price: number;
    qty_in_stock: number;
    image_url: string | null;
    is_active: boolean;
    items?: {
        id: string;
        price: number;
        qty_in_stock: number;
    }[];
    images?: {
        id: string;
        image_url: string;
    }[];
    category?: {
        id: string;
        category_name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface ProductVariation {
    id: string;
    product_category_id: string;
    variation_name: string;
    options: ProductVariationOption[];
    created_at: string;
    updated_at: string;
}

export interface ProductVariationOption {
    id: string;
    product_variation_id: string;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface ManageProductListResponse {
    data: ProductItemResponse[];
    meta: Meta;
}

export interface ProductShopListResponse {
    data: ProductShop[];
    meta: Meta;
}
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
    image_url: string;
    price: number;
    shop_name: string;
    shop_city: string;
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
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    createdAt: Date;
}
