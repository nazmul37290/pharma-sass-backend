import bcrypt from "bcryptjs";
import { AppError } from "../../common/errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.js";

export async function createUser(tenantId: string, data: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw new AppError(409, "User email already exists");
  }

  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : await bcrypt.hash("changeme123", 10);

  return prisma.user.create({
    data: {
      ...data,
      tenantId,
      password: passwordHash,
      status: data.status ?? "ACTIVE",
      roleId: data.roleId ?? (await getDefaultRoleId(tenantId)),
    },
    include: { role: true },
  });
}

export async function getUserById(id: string, tenantId: string) {
  return prisma.user.findFirst({
    where: { id, tenantId },
    include: { role: true },
  });
}

export async function listUsers(tenantId: string) {
  return prisma.user.findMany({
    where: { tenantId },
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUser(id: string, tenantId: string, data: UpdateUserInput) {
  const user = await prisma.user.findFirst({ where: { id, tenantId } });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updates: Record<string, unknown> = { ...data };

  if (data.password) {
    updates.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updates,
    include: { role: true },
  });
}

export async function deleteUser(id: string, tenantId: string) {
  const user = await prisma.user.findFirst({ where: { id, tenantId } });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return prisma.user.delete({ where: { id } });
}

async function getDefaultRoleId(tenantId: string) {
  const role = await prisma.role.findFirst({ where: { tenantId, name: "STAFF" } });

  if (!role) {
    const createdRole = await prisma.role.create({ data: { tenantId, name: "STAFF" } });
    return createdRole.id;
  }

  return role.id;
}
