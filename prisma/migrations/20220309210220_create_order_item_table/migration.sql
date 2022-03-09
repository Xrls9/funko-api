-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "funko_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_items_uuid_key" ON "order_items"("uuid");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_funko_id_fkey" FOREIGN KEY ("funko_id") REFERENCES "funkos"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
