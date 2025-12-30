import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

const nowSuffix = () => `${Date.now()}`;

type SeedResult = {
  buyerId: number;
  supplierProfileId: number;
  productId: number;
  rfqId: number;
  rfqItemId1: number;
  rfqItemId2: number;
};

async function seed(): Promise<SeedResult> {
  const suffix = nowSuffix();

  const role = await prisma.role.upsert({
    where: { name: "BUYER" },
    update: {},
    create: { name: "BUYER" },
  });

  const buyer = await prisma.user.create({
    data: {
      roleId: role.id,
      firstName: "Postman",
      lastName: "Buyer",
      userEmail: `postman+buyer+${suffix}@example.com`,
      status: "ACTIVE",
    },
  });

  const supplierUser = await prisma.user.create({
    data: {
      roleId: role.id,
      firstName: "Postman",
      lastName: "Supplier",
      userEmail: `postman+supplier+${suffix}@example.com`,
      status: "ACTIVE",
      supplierProfile: {
        create: {
          companyName: `Postman Supplies ${suffix}`,
          supplierEmail: `postman+supplier-profile+${suffix}@example.com`,
          verificationStatus: "PENDING",
        },
      },
    },
    include: { supplierProfile: true },
  });

  if (!supplierUser.supplierProfile) {
    throw new Error("Failed to create supplierProfile");
  }

  const category = await prisma.materialCategory.create({
    data: { categoryName: `Postman Category ${suffix}` },
  });

  const product = await prisma.product.create({
    data: {
      supplierId: supplierUser.supplierProfile.id,
      categoryId: category.id,
      productName: `Postman Product ${suffix}`,
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
      notes: "Postman seeded RFQ",
      items: {
        create: [
          {
            productId: product.id,
            description: "Postman RFQ item 1",
            quantity: "5",
            unit: "EA",
          },
          {
            productId: product.id,
            description: "Postman RFQ item 2",
            quantity: "3",
            unit: "EA",
          },
        ],
      },
    },
    include: { items: true },
  });

  if (rfq.items.length < 2) {
    throw new Error("Expected RFQ to have 2 items");
  }

  return {
    buyerId: buyer.id,
    supplierProfileId: supplierUser.supplierProfile.id,
    productId: product.id,
    rfqId: rfq.id,
    rfqItemId1: rfq.items[0].id,
    rfqItemId2: rfq.items[1].id,
  };
}

function writePostmanEnvironment(args: {
  outPath: string;
  baseUrl: string;
  seed: SeedResult;
}) {
  const env = {
    id: "frethan-local",
    name: "Frethan Local (auto-seeded)",
    values: [
      { key: "baseUrl", value: args.baseUrl, enabled: true },
      { key: "buyerId", value: String(args.seed.buyerId), enabled: true },
      { key: "supplierProfileId", value: String(args.seed.supplierProfileId), enabled: true },
      { key: "productId", value: String(args.seed.productId), enabled: true },
      { key: "rfqId", value: String(args.seed.rfqId), enabled: true },
      { key: "rfqItemId1", value: String(args.seed.rfqItemId1), enabled: true },
      { key: "rfqItemId2", value: String(args.seed.rfqItemId2), enabled: true },
    ],
    _postman_variable_scope: "environment",
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: "seedPostman.ts",
  };

  fs.mkdirSync(path.dirname(args.outPath), { recursive: true });
  fs.writeFileSync(args.outPath, JSON.stringify(env, null, 2), "utf8");
}

async function main() {
  const baseUrl = process.env.POSTMAN_BASE_URL || "http://localhost:5000";
  const outPath =
    process.env.POSTMAN_ENV_OUT ||
    path.join(process.cwd(), "postman", "frethan.local.postman_environment.json");

  const result = await seed();
  writePostmanEnvironment({ outPath, baseUrl, seed: result });

  console.log("✅ Seeded Postman test data");
  console.log({ ...result, baseUrl, postmanEnvOut: outPath });
}

main()
  .catch((e) => {
    console.error("❌ seedPostman failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
