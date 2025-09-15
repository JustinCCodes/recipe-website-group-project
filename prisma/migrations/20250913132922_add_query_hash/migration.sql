/*
  Warnings:

  - A unique constraint covering the columns `[userId,queryHash]` on the table `SearchHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `queryHash` to the `SearchHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queryHash` to the `SearchLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."SearchHistory_userId_query_key";

-- AlterTable
ALTER TABLE "public"."SearchHistory" ADD COLUMN     "queryHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SearchLog" ADD COLUMN     "queryHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SearchHistory_userId_queryHash_key" ON "public"."SearchHistory"("userId", "queryHash");
