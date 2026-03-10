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

export type ProfileSchema = z.infer<typeof profileSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
