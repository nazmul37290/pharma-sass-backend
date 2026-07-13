import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(2).max(80),
    permissionIds: z.array(z.string().min(1)).optional(),
});

export const roleIdParamSchema = z.object({
    id: z.string().min(1),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
