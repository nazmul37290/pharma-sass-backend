import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../common/errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type { LoginInput, TenantRegistrationInput } from "./auth.schema.js";

export async function registerTenant(input: TenantRegistrationInput) {
    const existingTenant = await prisma.tenant.findFirst({
        where: { name: input.tenantName },
    });

    if (existingTenant) {
        throw new AppError(409, "Tenant already exists");
    }

    const existingUser = await prisma.user.findUnique({ where: { email: input.adminEmail } });

    if (existingUser) {
        throw new AppError(409, "Admin email already exists");
    }

    const passwordHash = await bcrypt.hash(input.adminPassword, 10);

    return prisma.$transaction(async (tx) => {
        const tenant = await tx.tenant.create({
            data: {
                name: input.tenantName,
                plan: "FREE",
            },
        });

        const adminRole = await tx.role.create({
            data: {
                name: "ADMIN",
                tenantId: tenant.id,
            },
        });

        const permissions = await tx.permission.findMany();

        await tx.rolePermission.createMany({
            data: permissions.filter(p => p.action !== 'manage_permissions').map((permission) =>
            (
                {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                }
            )


            ),
        });

        const adminUser = await tx.user.create({
            data: {
                name: input.adminName,
                email: input.adminEmail,
                password: passwordHash,
                tenantId: tenant.id,
                roleId: adminRole.id,
                status: "ACTIVE",
            },
        });

        return {
            tenant,
            adminUser,
            token: createToken(adminUser.id, tenant.id, adminRole.id, adminRole.name, adminUser.email),
        };
    });
}

export async function login(input: LoginInput) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { role: true, tenant: true },
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
        throw new AppError(401, "Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(403, "Account is inactive");
    }

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            tenantId: user.tenantId,
            roleId: user.roleId,
            roleName: user.role.name,
            tenantName: user.tenant.name,
        },
        token: createToken(user.id, user.tenantId, user.roleId, user.role.name, user.email),
    };
}

function createToken(sub: string, tenantId: string, roleId: string, roleName: string, email: string) {
    return jwt.sign({ sub, tenantId, roleId, roleName, email }, env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
