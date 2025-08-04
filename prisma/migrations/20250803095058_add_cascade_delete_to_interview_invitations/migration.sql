-- DropForeignKey
ALTER TABLE "interview_invitations" DROP CONSTRAINT "interview_invitations_applicantId_fkey";

-- AddForeignKey
ALTER TABLE "interview_invitations" ADD CONSTRAINT "interview_invitations_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
