/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.
  - You are about to alter the column `unitPrice` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.
  - You are about to alter the column `totalPrice` on the `carts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.
  - You are about to alter the column `totalPrice` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.
  - You are about to alter the column `unitPrice` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.
  - You are about to alter the column `totalPrice` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.

*/
-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "totalPrice" SET DATA TYPE REAL,
ALTER COLUMN "unitPrice" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "totalPrice" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "totalPrice" SET DATA TYPE REAL,
ALTER COLUMN "unitPrice" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalPrice" SET DATA TYPE REAL;
