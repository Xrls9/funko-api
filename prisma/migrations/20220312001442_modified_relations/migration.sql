-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_funko_id_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "funko_reactions" DROP CONSTRAINT "funko_reactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "funkos" DROP CONSTRAINT "funkos_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_funko_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "funko_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "funko_reactions" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "funkos" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "funko_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funkos" ADD CONSTRAINT "funkos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funko_reactions" ADD CONSTRAINT "funko_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_funko_id_fkey" FOREIGN KEY ("funko_id") REFERENCES "funkos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_funko_id_fkey" FOREIGN KEY ("funko_id") REFERENCES "funkos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
