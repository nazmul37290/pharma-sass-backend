import { AppError } from "../../common/errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateRoleInput } from "./role.schema.js";

export async function listRoles(tenantId: string) {
    return prisma.role.findMany({
        where: { tenantId },
        include: { permissions: { include: { permission: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function createRole(tenantId: string, input: CreateRoleInput) {
    const existing = await prisma.role.findFirst({ where: { tenantId, name: input.name } });

    if (existing) {
        throw new AppError(409, "Role already exists");
    }

    return prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
            data: { tenantId, name: input.name },
            include: { permissions: { include: { permission: true } } },
        });

        if (input.permissionIds?.length) {
            const validPermissions = await tx.permission.findMany({
                where: { id: { in: input.permissionIds } },
            });

            if (validPermissions.length !== input.permissionIds.length) {
                throw new AppError(400, "One or more permissions are invalid");
            }

            await tx.rolePermission.createMany({
                data: input.permissionIds.map((permissionId) => ({
                    roleId: role.id,
                    permissionId,
                })),
            });
        }

        return tx.role.findUniqueOrThrow({
            where: { id: role.id },
            include: { permissions: { include: { permission: true } } },
        });
    });
}

export async function getRole(id: string, tenantId: string) {
    return prisma.role.findFirst({
        where: { id, tenantId },
        include: { permissions: { include: { permission: true } } },
    });
}

export async function deleteRole(id: string, tenantId: string) {
    return prisma.$transaction(async (tx) => {
        const staffRole = await tx.role.findFirst({ where: { tenantId, name: "STAFF" } });

        if (!staffRole) {
            throw new AppError(400, "A STAFF role must exist before deleting roles");
        }

        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        await tx.user.updateMany({ where: { roleId: id }, data: { roleId: staffRole.id } });
        return tx.role.deleteMany({ where: { id, tenantId } });
    });
}
