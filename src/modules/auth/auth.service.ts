import crypto from "node:crypto";
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
    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: { role: true, tenant: true },
    });

    if (user) {
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

    if (await isValidSuperAdminCredential(normalizedEmail, input.password)) {
        const superAdminEmail = env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();

        return {
            user: {
                id: "super-admin",
                name: "Super Admin",
                email: superAdminEmail,
                tenantId: null,
                roleId: null,
                roleName: "SUPER_ADMIN",
                tenantName: "Platform",
                isSuperAdmin: true,
            },
            token: createToken("super-admin", undefined, undefined, "SUPER_ADMIN", superAdminEmail ?? normalizedEmail, true),
        };
    }

    throw new AppError(401, "Invalid credentials");
}

async function isValidSuperAdminCredential(email: string, password: string): Promise<boolean> {
    const configuredEmail = env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const configuredPassword = env.SUPER_ADMIN_PASSWORD;
    const configuredPasswordHash = env.SUPER_ADMIN_PASSWORD_HASH;

    if (!configuredEmail || (!configuredPassword && !configuredPasswordHash)) {
        return false;
    }

    if (email !== configuredEmail) {
        return false;
    }

    if (configuredPasswordHash) {
        return bcrypt.compare(password, configuredPasswordHash);
    }

    if (!configuredPassword) {
        return false;
    }

    return compareStrings(password, configuredPassword);
}

function compareStrings(input: string, expected: string): boolean {
    const inputBuffer = Buffer.from(input, "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");

    if (inputBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

function createToken(sub: string, tenantId: string | undefined, roleId: string | undefined, roleName: string, email: string, isSuperAdmin = false) {
    return jwt.sign({ sub, tenantId, roleId, roleName, email, isSuperAdmin }, env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
