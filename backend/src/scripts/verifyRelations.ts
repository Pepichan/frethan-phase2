import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const nowSuffix = () => `${Date.now()}`;

async function main() {
  const suffix = nowSuffix();

  const role = await prisma.role.upsert({
    where: { name: "BUYER" },
    update: {},
    create: { name: "BUYER" },
  });

  const buyerEmail = `verify+buyer+${suffix}@example.com`;
  const supplierEmail = `verify+supplier+${suffix}@example.com`;

  const buyer = await prisma.user.create({
    data: {
      roleId: role.id,
      firstName: "Verify",
      lastName: "Buyer",
      userEmail: buyerEmail,
      status: "ACTIVE",
    },
  });

  const supplierUser = await prisma.user.create({
    data: {
      roleId: role.id,
      firstName: "Verify",
      lastName: "Supplier",
      userEmail: supplierEmail,
      status: "ACTIVE",
      supplierProfile: {
        create: {
          companyName: `Verify Supplies ${suffix}`,
          supplierEmail: `supplier-profile+${suffix}@example.com`,
          verificationStatus: "PENDING",
        },
      },
    },
    include: { supplierProfile: true },
  });

  const social = await prisma.userSocialAccount.create({
    data: {
      provider: "google",
      providerUserId: `google-${suffix}`,
      email: buyerEmail,
      userId: buyer.id,
    },
  });

  const category = await prisma.materialCategory.create({
    data: { categoryName: `Verify Category ${suffix}` },
  });

  const product = await prisma.product.create({
    data: {
      supplierId: supplierUser.supplierProfile!.id,
      categoryId: category.id,
      productName: `Verify Product ${suffix}`,
      unit: "EA",
      basePrice: "10.00",
      currency: "AUD",
    },
  });

  const rfq = await prisma.rFQ.create({
    data: {
      buyerId: buyer.id,
      status: "OPEN",
      currency: "AUD",
      items: {
        create: [
          {
            productId: product.id,
            description: "Verify RFQ item",
            quantity: "5",
            unit: "EA",
          },
        ],
      },
    },
    include: { items: true },
  });

  const quote = await prisma.quote.create({
    data: {
      rfqId: rfq.id,
      supplierId: supplierUser.supplierProfile!.id,
      totalPrice: "50.00",
      currency: "AUD",
      status: "PENDING",
      items: {
        create: [
          {
            rfqItemId: rfq.items[0].id,
            unitPrice: "10.00",
            quantity: "5",
            subtotal: "50.00",
          },
        ],
      },
    },
  });

  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      supplierId: supplierUser.supplierProfile!.id,
      quoteId: quote.id,
      status: "PENDING",
      totalAmount: "50.00",
      currency: "AUD",
      items: {
        create: [
          {
            productId: product.id,
            quantity: "5",
            unitPrice: "10.00",
            lineTotal: "50.00",
          },
        ],
      },
      contractRef: {
        create: {
          contractAddress: "0xDEMO_CONTRACT",
          transactionHash: `0xDEMO_TX_${suffix}`,
        },
      },
      notifications: {
        create: {
          userId: buyer.id,
          type: "ORDER_CREATED",
          message: "Verify order created",
        },
      },
    },
    include: {
      items: true,
      contractRef: true,
      notifications: true,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      buyerId: buyer.id,
      amount: "50.00",
      currency: "AUD",
      receivedAt: new Date(),
      method: "BANK_TRANSFER",
      status: "COMPLETED",
    },
  });

  const summary = await prisma.user.findUnique({
    where: { id: buyer.id },
    include: {
      socialAccounts: true,
      rfqs: true,
      orders: { include: { contractRef: true } },
      payments: true,
      notifications: true,
    },
  });

  console.log("✅ Created sample data successfully");
  console.log({
    buyerId: buyer.id,
    supplierProfileId: supplierUser.supplierProfile!.id,
    rfqId: rfq.id,
    quoteId: quote.id,
    orderId: order.id,
    paymentId: payment.id,
    socialAccountId: social.id,
  });

  console.log("✅ Relation check (buyer include) OK:");
  console.log({
    socialAccounts: summary?.socialAccounts.length,
    rfqs: summary?.rfqs.length,
    orders: summary?.orders.length,
    payments: summary?.payments.length,
    notifications: summary?.notifications.length,
  });
}

main()
  .catch((e) => {
    console.error("❌ verifyRelations failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
