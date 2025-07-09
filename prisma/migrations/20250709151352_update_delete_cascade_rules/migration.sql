-- DropForeignKey
ALTER TABLE "application_stage_history" DROP CONSTRAINT "application_stage_history_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_jobPostId_fkey";

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_stage_history" ADD CONSTRAINT "application_stage_history_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
