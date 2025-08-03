/*
  Warnings:

  - A unique constraint covering the columns `[applicantId,jobPostId]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "applications_applicantId_jobPostId_key" ON "applications"("applicantId", "jobPostId");
