import { z } from "zod";

export const createPermissionSchema = z.object({
    action: z.string().min(2).max(100),
    description: z.string().max(200).optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
