-- CreateTable
CREATE TABLE "funkos" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funkos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funkos_uuid_key" ON "funkos"("uuid");

-- AddForeignKey
ALTER TABLE "funkos" ADD CONSTRAINT "funkos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
