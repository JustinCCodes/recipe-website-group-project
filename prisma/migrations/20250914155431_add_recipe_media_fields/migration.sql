/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "imageUrl",
ADD COLUMN     "durationSec" INTEGER,
ADD COLUMN     "likes" INTEGER,
ADD COLUMN     "mediaType" TEXT NOT NULL DEFAULT 'video',
ADD COLUMN     "mediaUrl" TEXT NOT NULL DEFAULT 'https://via.placeholder.com/400.mp4';
