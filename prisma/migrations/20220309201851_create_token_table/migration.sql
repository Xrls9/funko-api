-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "aud" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_uuid_key" ON "tokens"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_jti_key" ON "tokens"("jti");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
