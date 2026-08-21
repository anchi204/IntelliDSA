ALTER TABLE "Problem" ADD COLUMN "link" TEXT;
ALTER TABLE "Problem" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "Problem_solved_idx" ON "Problem"("solved");
CREATE INDEX "Problem_revisionDate_idx" ON "Problem"("revisionDate");
CREATE INDEX "Problem_topic_idx" ON "Problem"("topic");
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");
