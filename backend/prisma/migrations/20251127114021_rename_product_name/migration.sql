/*
  Warnings:

  - You are about to drop the column `product_name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_product_name_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "product_name",
ADD COLUMN     "productName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Product_productName_idx" ON "Product"("productName");
