-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "authorId" INTEGER,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
