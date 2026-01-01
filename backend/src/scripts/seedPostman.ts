import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const buyerRole = await prisma.role.upsert({
    where: { name: "BUYER" },
    update: {},
    create: { name: "BUYER" },
  });

  const supplierRole = await prisma.role.upsert({
    where: { name: "SUPPLIER" },
    update: {},
    create: { name: "SUPPLIER" },
  });

  const buyer = await prisma.user.upsert({
    where: { userEmail: "buyer@example.com" },
    update: {},
    create: {
      roleId: buyerRole.id,
      firstName: "Buyer",
      lastName: "Test",
      userEmail: "buyer@example.com",
      status: "ACTIVE",
    },
  });

  const supplierUser = await prisma.user.upsert({
    where: { userEmail: "supplier@example.com" },
    update: {},
    create: {
      roleId: supplierRole.id,
      firstName: "Supplier",
      lastName: "Test",
      userEmail: "supplier@example.com",
      status: "ACTIVE",
    },
  });

  const supplierProfile = await prisma.supplierProfile.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      userId: supplierUser.id,
      companyName: "Test Supplier Co",
      supplierEmail: "supplier@example.com",
      verificationStatus: "VERIFIED",
    },
  });

  // Create a draft RFQ with 1 item for convenience
  const rfq = await prisma.rFQ.create({
    data: {
      buyerId: buyer.id,
      status: "DRAFT",
      currency: "AUD",
      notes: "Seeded RFQ",
      items: {
        create: [{ description: "Steel rods", quantity: 10 as any, unit: "pcs" }],
      },
    },
    include: { items: true },
  });

  const env = {
    name: "frethan.local",
    values: [
      { key: "baseUrl", value: "http://localhost:5000", type: "default", enabled: true },
      { key: "buyerId", value: String(buyer.id), type: "default", enabled: true },
      { key: "supplierId", value: String(supplierProfile.id), type: "default", enabled: true },
      { key: "rfqId", value: String(rfq.id), type: "default", enabled: true },
      { key: "rfqItemId", value: String(rfq.items[0]?.id ?? ""), type: "default", enabled: true }
    ],
  };

  // Print JSON so user can redirect output to a file if desired.
  console.log(JSON.stringify(env, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
