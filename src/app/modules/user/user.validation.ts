import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must contain only letters and spaces",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9]{10}$/, {
      message: "Phone must be a valid number with 10 digits",
    })
    .optional(),

  picture: z
    .string()
    .url({ message: "Picture must be a valid URL" })
    .optional(),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must contain only letters and spaces",
    })
    .optional(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9]{10}$/, {
      message: "Phone must be a valid number with 10 digits",
    })
    .optional(),

  picture: z
    .string()
    .url({ message: "Picture must be a valid URL" })
    .optional(),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ message: "IsDeleted must be true of false" })
    .optional(),
  isVerified: z.boolean().optional(),
});
