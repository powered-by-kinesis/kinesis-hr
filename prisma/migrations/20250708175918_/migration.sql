-- CreateEnum
CREATE TYPE "InterviewInvitationStatus" AS ENUM ('COMPLETED', 'INVITED');

-- AlterTable
ALTER TABLE "applicants" ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "interview_invitations" ADD COLUMN     "dateTaken" TIMESTAMP(3),
ADD COLUMN     "status" "InterviewInvitationStatus" NOT NULL DEFAULT 'INVITED';

-- CreateIndex
CREATE INDEX "applicants_userId_email_idx" ON "applicants"("userId", "email");
