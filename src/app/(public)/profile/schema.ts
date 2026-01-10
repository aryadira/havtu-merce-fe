import z from "zod";

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  PREFER_NOT_TO_SAY = "prefer-not-to-say",
}

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(3, "Fullname must be at least 3 characters long")
    .optional(),
  username: z
    .string()
    .min(4, "Username must be at least 3 characters long")
    .optional(),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  gender: z.nativeEnum(UserGender).optional(),
  birthdate: z.string().optional(),
  avatar: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
