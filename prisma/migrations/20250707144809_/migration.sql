-- CreateTable
CREATE TABLE "interviews" (
    "id" SERIAL NOT NULL,
    "interviewName" TEXT NOT NULL,
    "skills" JSONB NOT NULL,
    "customQuestionList" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobPostId" INTEGER,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_interviews" (
    "id" SERIAL NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "interviewId" INTEGER NOT NULL,

    CONSTRAINT "applicant_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicant_interviews_applicantId_interviewId_key" ON "applicant_interviews"("applicantId", "interviewId");

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_interviews" ADD CONSTRAINT "applicant_interviews_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_interviews" ADD CONSTRAINT "applicant_interviews_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
