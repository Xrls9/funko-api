-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "cart_id" TEXT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "order_id" TEXT;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
