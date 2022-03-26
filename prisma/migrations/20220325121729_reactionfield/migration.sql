/*
  Warnings:

  - Changed the type of `reaction` on the `funko_reactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "funko_reactions" DROP COLUMN "reaction",
ADD COLUMN     "reaction" "Reactions" NOT NULL;
