/*
  Warnings:

  - You are about to drop the column `likes` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "public"."Like" (
    "recipeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("recipeId","userId")
);

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
