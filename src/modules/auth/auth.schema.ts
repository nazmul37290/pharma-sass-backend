import { z } from "zod";

export const tenantRegistrationSchema = z.object({
    tenantName: z.string().min(2).max(120),
    adminName: z.string().min(2).max(120),
    adminEmail: z.string().email(),
    adminPassword: z.string().min(8).max(100),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

export type TenantRegistrationInput = z.infer<typeof tenantRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
