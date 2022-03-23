-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'';
