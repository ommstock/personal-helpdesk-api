/*
  Warnings:

  - The `oldValue` column on the `AuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `newValue` column on the `AuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "oldValue",
ADD COLUMN     "oldValue" JSONB,
DROP COLUMN "newValue",
ADD COLUMN     "newValue" JSONB;
