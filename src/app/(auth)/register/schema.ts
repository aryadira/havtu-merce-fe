import z from "zod";

export const registerSchema = z
  .object({
    fullname: z.string().min(5, "Nama lengkap minimal 5 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    passwordConfirm: z.string().min(6),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Konfirmasi password tidak sesuai",
        path: ["passwordConfirm"],
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
