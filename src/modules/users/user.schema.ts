import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(100).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
