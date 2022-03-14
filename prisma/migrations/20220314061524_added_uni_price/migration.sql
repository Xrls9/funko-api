-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "unitPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "unitPrice" DECIMAL(65,30);
