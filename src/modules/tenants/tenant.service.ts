import { prisma } from "../../lib/prisma.js";

export async function listTenants() {
    return prisma.tenant.findMany({
        include: {
            _count: {
                select: {
                    users: true,
                    roles: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}
