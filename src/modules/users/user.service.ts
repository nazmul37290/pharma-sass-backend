import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput } from "./user.schema.js";

export async function createUser(data: CreateUserInput) {
  return prisma.user.create({ data });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}
