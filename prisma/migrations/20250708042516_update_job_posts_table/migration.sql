/*
  Warnings:

  - Added the required column `department` to the `job_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_posts" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "salaryMax" DECIMAL(12,2),
ADD COLUMN     "salaryMin" DECIMAL(12,2),
ADD COLUMN     "salaryType" TEXT;
