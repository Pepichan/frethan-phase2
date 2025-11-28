/*
  Warnings:

  - You are about to alter the column `receivedQty` on the `GoodsReceiptItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `acceptedQty` on the `GoodsReceiptItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `rejectedQty` on the `GoodsReceiptItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `quantity` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `quantity` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - The `status` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `quantity` on the `QuoteItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - The `status` column on the `RFQ` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `quantity` on the `RFQItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to drop the column `email` on the `SupplierProfile` table. All the data in the column will be lost.
  - The `addresses` column on the `SupplierProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `verificationStatus` column on the `SupplierProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - The `addresses` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[supplierEmail]` on the table `SupplierProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,providerUserId]` on the table `UserSocialAccount` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `ComplianceCertificate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `GoodsReceipt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `method` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Shipment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `supplierEmail` to the `SupplierProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SupplierVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GoodsReceiptStatus" AS ENUM ('PENDING', 'PARTIAL', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_goodsReceiptId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentAllocation" DROP CONSTRAINT "PaymentAllocation_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "QuoteItem" DROP CONSTRAINT "QuoteItem_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "RFQItem" DROP CONSTRAINT "RFQItem_rfqId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentUpdate" DROP CONSTRAINT "ShipmentUpdate_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierProfile" DROP CONSTRAINT "SupplierProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSocialAccount" DROP CONSTRAINT "UserSocialAccount_userId_fkey";

-- DropIndex
DROP INDEX "SupplierProfile_email_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "ComplianceCertificate" DROP COLUMN "status",
ADD COLUMN     "status" "CertificateStatus" NOT NULL;

-- AlterTable
ALTER TABLE "GoodsReceipt" DROP COLUMN "status",
ADD COLUMN     "status" "GoodsReceiptStatus" NOT NULL;

-- AlterTable
ALTER TABLE "GoodsReceiptItem" ALTER COLUMN "receivedQty" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "acceptedQty" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "rejectedQty" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "status",
ADD COLUMN     "status" "InvoiceStatus" NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "method",
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "status",
ADD COLUMN     "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "QuoteItem" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "RFQ" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'AUD',
DROP COLUMN "status",
ADD COLUMN     "status" "RFQStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "RFQItem" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "status",
ADD COLUMN     "status" "ShipmentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SupplierProfile" DROP COLUMN "email",
ADD COLUMN     "supplierEmail" TEXT NOT NULL,
DROP COLUMN "addresses",
ADD COLUMN     "addresses" JSON,
DROP COLUMN "verificationStatus",
ADD COLUMN     "verificationStatus" "SupplierVerificationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockoutUntil" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ALTER COLUMN "passwordHash" DROP NOT NULL,
DROP COLUMN "addresses",
ADD COLUMN     "addresses" JSON,
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "ComplianceCertificate_productId_idx" ON "ComplianceCertificate"("productId");

-- CreateIndex
CREATE INDEX "ComplianceCertificate_supplierId_idx" ON "ComplianceCertificate"("supplierId");

-- CreateIndex
CREATE INDEX "ComplianceCertificate_status_idx" ON "ComplianceCertificate"("status");

-- CreateIndex
CREATE INDEX "GoodsReceipt_orderId_idx" ON "GoodsReceipt"("orderId");

-- CreateIndex
CREATE INDEX "GoodsReceipt_shipmentId_idx" ON "GoodsReceipt"("shipmentId");

-- CreateIndex
CREATE INDEX "GoodsReceipt_receivedByUserId_idx" ON "GoodsReceipt"("receivedByUserId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_goodsReceiptId_idx" ON "GoodsReceiptItem"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_orderItemId_idx" ON "GoodsReceiptItem"("orderItemId");

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceItem_orderItemId_idx" ON "InvoiceItem"("orderItemId");

-- CreateIndex
CREATE INDEX "MaterialCategory_categoryName_idx" ON "MaterialCategory"("categoryName");

-- CreateIndex
CREATE INDEX "Order_buyerId_orderDate_idx" ON "Order"("buyerId", "orderDate");

-- CreateIndex
CREATE INDEX "Order_supplierId_idx" ON "Order"("supplierId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Payment_buyerId_receivedAt_idx" ON "Payment"("buyerId", "receivedAt");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "PaymentAllocation_paymentId_idx" ON "PaymentAllocation"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentAllocation_invoiceId_idx" ON "PaymentAllocation"("invoiceId");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_product_name_idx" ON "Product"("product_name");

-- CreateIndex
CREATE INDEX "Quote_rfqId_idx" ON "Quote"("rfqId");

-- CreateIndex
CREATE INDEX "Quote_supplierId_idx" ON "Quote"("supplierId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId");

-- CreateIndex
CREATE INDEX "QuoteItem_rfqItemId_idx" ON "QuoteItem"("rfqItemId");

-- CreateIndex
CREATE INDEX "RFQ_buyerId_createdAt_idx" ON "RFQ"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "RFQ_status_idx" ON "RFQ"("status");

-- CreateIndex
CREATE INDEX "RFQItem_rfqId_idx" ON "RFQItem"("rfqId");

-- CreateIndex
CREATE INDEX "RFQItem_productId_idx" ON "RFQItem"("productId");

-- CreateIndex
CREATE INDEX "Shipment_orderId_idx" ON "Shipment"("orderId");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "ShipmentUpdate_shipmentId_eventTime_idx" ON "ShipmentUpdate"("shipmentId", "eventTime");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_supplierEmail_key" ON "SupplierProfile"("supplierEmail");

-- CreateIndex
CREATE INDEX "SupplierProfile_companyName_idx" ON "SupplierProfile"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialAccount_provider_providerUserId_key" ON "UserSocialAccount"("provider", "providerUserId");

-- AddForeignKey
ALTER TABLE "SupplierProfile" ADD CONSTRAINT "SupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQItem" ADD CONSTRAINT "RFQItem_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentUpdate" ADD CONSTRAINT "ShipmentUpdate_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAllocation" ADD CONSTRAINT "PaymentAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialAccount" ADD CONSTRAINT "UserSocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
