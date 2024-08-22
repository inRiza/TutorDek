import {z, string} from 'zod'

export const signInSchema = z.object({
    email: string({ required_error: "Email is required." })
        .min(1, "Email is required.")
        .email("Invalid email."),
    password: string({ required_error: "Password is required." })
        .min(1, "Password is required.")
        .min(8, "Password must be more than 8 characters.")
        .max(32, "Password must be less than 32 characters.")
})

export const signUpSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().min(1),
    phoneNumber: z.string().min(8),
    password: z.string().min(8)
})

export const userDataSchema = z.object({
    fullName: z.string().min(1).max(50),
    email: z.string().min(1),
    phoneNumber: z.string().min(1).max(15),
    password: z.string().min(1).max(16),
    role: z.enum(["Mahasiswa", "Tutor", "Admin"])
  })