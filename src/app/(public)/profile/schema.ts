import z from 'zod';

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    PREFER_NOT_TO_SAY = 'prefer-not-to-say',
}

export const profileSchema = z.object({
    fullname: z.string().min(3, 'Fullname must be at least 3 characters long').optional(),
    username: z.string().min(4, 'Username must be at least 3 characters long').optional(),
    phone_number: z.string().min(10, 'Phone number must be at least 10 characters long').optional(),
    email: z.string().email('Invalid email address').optional(),
    gender: z.nativeEnum(UserGender).optional(),
    birthdate: z.string().optional(),
    avatar: z.string().optional(),
});

export const addressSchema = z.object({
    address: z.string().min(5, 'Address must be at least 5 characters long'),
    city: z.string().min(2, 'City must be at least 2 characters long'),
    province: z.string().min(2, 'Province must be at least 2 characters long'),
    postal_code: z.string().min(5, 'Postal code must be at least 5 characters long'),
    country: z.string().min(2, 'Country must be at least 2 characters long'),
    is_default: z.boolean(),
});

export const paymentMethodSchema = z.object({
    payment_type_id: z.string().uuid('Invalid payment type'),
    bank_id: z.string().uuid('Invalid bank'),
    provider: z.string().min(2, 'Provider must be at least 2 characters long'),
    account_number: z.string().min(5, 'Account number must be at least 5 characters long'),
    account_holder: z.string().min(3, 'Account holder name must be at least 3 characters long'),
    description: z.string().optional(),
});

export const shopSchema = z.object({
    shop_type: z.string().min(1, 'Shop Type is required'),
    shop_name: z.string().min(3, 'Shop Name must be at least 3 characters long'),
    shop_description: z.string().min(5, 'Shop Description is required'),
    shop_address: z.string().min(5, 'Shop Address must be at least 5 characters long'),
    shop_city: z.string().min(2, 'City is required'),
    shop_province: z.string().min(2, 'Province is required'),
    shop_country: z.string().min(2, 'Country is required'),
    shop_postal_code: z.string().min(2, 'Postal Code is required'),
    shop_phone_number: z.string().optional(),
    shop_email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type PaymentMethodSchema = z.infer<typeof paymentMethodSchema>;
export type ShopSchema = z.infer<typeof shopSchema>;
