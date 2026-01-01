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

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const buyer = await prisma.user.upsert({
    where: { userEmail: "buyer.qa.w6@example.com" },
    update: { roleId: buyerRole.id },
    create: {
      roleId: buyerRole.id,
      firstName: "Buyer",
      lastName: "QA",
      userEmail: "buyer.qa.w6@example.com",
      status: "ACTIVE",
    },
  });

  const supplierUser = await prisma.user.upsert({
    where: { userEmail: "supplier.qa.w6@example.com" },
    update: { roleId: supplierRole.id },
    create: {
      roleId: supplierRole.id,
      firstName: "Supplier",
      lastName: "QA",
      userEmail: "supplier.qa.w6@example.com",
      status: "ACTIVE",
    },
  });

  const admin = await prisma.user.upsert({
    where: { userEmail: "admin.qa.w6@example.com" },
    update: { roleId: adminRole.id },
    create: {
      roleId: adminRole.id,
      firstName: "Admin",
      lastName: "QA",
      userEmail: "admin.qa.w6@example.com",
      status: "ACTIVE",
    },
  });

  const supplierProfile = await prisma.supplierProfile.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      userId: supplierUser.id,
      companyName: "QA Supplier Co",
      supplierEmail: "supplier.qa.w6@example.com",
      verificationStatus: "VERIFIED",
    },
  });

  // RFQ -> Quote -> Order chain (minimal for QA)
  const rfq = await prisma.rFQ.create({
    data: {
      buyerId: buyer.id,
      status: "DRAFT",
      currency: "AUD",
      notes: "W6 QA Seed RFQ",
      items: {
        create: [{ description: "QA item", quantity: "10", unit: "pcs" }],
      },
    },
    include: { items: true },
  });

  const rfqItem = rfq.items[0];
  if (!rfqItem) {
    throw new Error("Failed to create RFQ item");
  }

  const unitPrice = "12.50";
  const subtotal = "125.00"; // 10 * 12.50

  const quote = await prisma.quote.create({
    data: {
      rfqId: rfq.id,
      supplierId: supplierProfile.id,
      totalPrice: subtotal,
      currency: rfq.currency,
      status: "PENDING",
    },
  });

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      rfqItemId: rfqItem.id,
      unitPrice,
      quantity: String(rfqItem.quantity),
      subtotal,
    },
  });

  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      supplierId: supplierProfile.id,
      quoteId: quote.id,
      status: "PENDING",
      totalAmount: subtotal,
      currency: rfq.currency,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      buyerId: buyer.id,
      orderId: order.id,
      amount: subtotal,
      currency: rfq.currency,
      receivedAt: new Date(),
      method: "BANK_TRANSFER",
      status: "COMPLETED",
      reference: "W6-QA-SEED",
    },
  });

  const buyerNotification = await prisma.notification.create({
    data: {
      userId: buyer.id,
      orderId: order.id,
      type: "QA_SEED",
      message: `W6 QA seeded order #${order.id} created`,
    },
  });

  const supplierNotification = await prisma.notification.create({
    data: {
      userId: supplierUser.id,
      orderId: order.id,
      type: "QA_SEED",
      message: `W6 QA seeded order #${order.id} assigned to supplier`,
    },
  });

  const output = {
    baseUrl: "http://localhost:5000",
    buyerUserId: buyer.id,
    buyerEmail: buyer.userEmail,
    supplierUserId: supplierUser.id,
    supplierProfileId: supplierProfile.id,
    supplierEmail: supplierUser.userEmail,
    adminUserId: admin.id,
    adminEmail: admin.userEmail,
    rfqId: rfq.id,
    rfqItemId: rfqItem.id,
    quoteId: quote.id,
    orderId: order.id,
    paymentId: payment.id,
    buyerNotificationId: buyerNotification.id,
    supplierNotificationId: supplierNotification.id,
  };

  // Print JSON so QA can redirect output to a file if desired.
  console.log(JSON.stringify(output, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
