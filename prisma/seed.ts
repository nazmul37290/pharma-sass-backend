import {prisma} from '../src/lib/prisma.ts'

const permissions = [
  { action: "view_products", description: "View products" },
  { action: "create_orders", description: "Create orders" },
  { action: "view_customers", description: "View customers" },
  { action: "manage_users", description: "Manage users" },
  { action: "manage_roles", description: "Manage roles" },
  { action: "manage_permissions", description: "Manage permissions" },
];

async function main() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { action: permission.action },
      update: { description: permission.description },
      create: permission,
    });
  }

  console.log("Seeded permissions successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
