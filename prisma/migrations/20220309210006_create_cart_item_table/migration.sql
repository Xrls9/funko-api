-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "funko_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_uuid_key" ON "cart_items"("uuid");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_funko_id_fkey" FOREIGN KEY ("funko_id") REFERENCES "funkos"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
