-- CreateTable
CREATE TABLE "candidates" (
    "id" SERIAL NOT NULL,
    "candidateId" TEXT NOT NULL,
    "contextId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "skills" TEXT[],
    "experience" TEXT[],
    "overallScore" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "justification" TEXT NOT NULL,
    "keyStrengths" TEXT[],
    "keyWeaknesses" TEXT[],
    "redFlags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_candidateId_key" ON "candidates"("candidateId");

-- CreateIndex
CREATE INDEX "candidates_contextId_score_idx" ON "candidates"("contextId", "score");

-- CreateIndex
CREATE INDEX "candidates_candidateId_idx" ON "candidates"("candidateId");

-- CreateIndex
CREATE INDEX "candidates_contextId_idx" ON "candidates"("contextId");

-- CreateIndex
CREATE INDEX "candidates_deletedAt_idx" ON "candidates"("deletedAt");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "contexts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
