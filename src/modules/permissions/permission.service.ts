import { prisma } from "../../lib/prisma.js";
import type { CreatePermissionInput } from "./permission.schema.js";

export async function listPermissions() {
    return prisma.permission.findMany({ orderBy: { action: "asc" } });
}

export async function createPermission(input: CreatePermissionInput) {
    return prisma.permission.create({ data: input });
}
