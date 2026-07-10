-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "createdByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
