-- CreateTable
CREATE TABLE "funko_reactions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "funko_id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funko_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funko_reactions_uuid_key" ON "funko_reactions"("uuid");

-- AddForeignKey
ALTER TABLE "funko_reactions" ADD CONSTRAINT "funko_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funko_reactions" ADD CONSTRAINT "funko_reactions_funko_id_fkey" FOREIGN KEY ("funko_id") REFERENCES "funkos"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
