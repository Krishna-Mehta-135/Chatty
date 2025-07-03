import { z } from "zod";

const registerUserSchema = z.object({
    fullName:  z
                .string()
                .min(2 ,"Name must be at least 2 characters long")
                .trim(),
    password:  z
                .string()
                .min(8 ,"Password must be 8 characters long")
                .max(20 ,"Password must not exceed 20 character")
                .trim()
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
                .trim(),
    email:     z
                .string()
                .email("Please enter a valid email address")
                .trim()
                .toLowerCase(),
})

const loginUserSchema = z.object({
    email:     z
                .string()
                .email("Please enter a valid email address")
                .trim()
                .toLowerCase(),
    password:      z
                    .string()
                    .min(8 ,"Password must be 8 characters long")
                    .max(20 ,"Password must not exceed 20 character")
                    .trim()
})

export {registerUserSchema, loginUserSchema}