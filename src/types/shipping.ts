export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
}

export type ShippingAddress = {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};