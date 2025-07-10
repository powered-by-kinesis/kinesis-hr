/*
  Warnings:

  - You are about to drop the `applicant_interviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "applicant_interviews" DROP CONSTRAINT "applicant_interviews_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "applicant_interviews" DROP CONSTRAINT "applicant_interviews_interviewId_fkey";

-- DropTable
DROP TABLE "applicant_interviews";

-- CreateTable
CREATE TABLE "interview_invitations" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_invitations_token_key" ON "interview_invitations"("token");

-- AddForeignKey
ALTER TABLE "interview_invitations" ADD CONSTRAINT "interview_invitations_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_invitations" ADD CONSTRAINT "interview_invitations_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
