-- CreateEnum
CREATE TYPE "ModuleId" AS ENUM ('DNA_STRUCTURE', 'DNA_REPLICATION', 'TRANSCRIPTION', 'TRANSLATION', 'GENETIC_CODE', 'MUTATIONS', 'GENE_REGULATION', 'PROTEINS', 'CELL_CYCLE', 'EPIGENETICS', 'GENOMICS', 'BIOINFORMATICS', 'EVOLUTION', 'AMINO_ACIDS', 'VIRTUAL_LAB');

-- CreateEnum
CREATE TYPE "EvalType" AS ENUM ('FORMATIVE', 'SUMMATIVE');

-- CreateTable
CREATE TABLE "Progress" (
    "userId" TEXT NOT NULL,
    "visitedModules" "ModuleId"[],
    "totalTimeMs" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ModuleVisit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" "ModuleId" NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" "ModuleId",
    "score" DOUBLE PRECISION NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedIdx" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualLabSequence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualLabSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "evalType" "EvalType" NOT NULL,
    "moduleIds" "ModuleId"[],
    "score" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvalSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleVisit_userId_idx" ON "ModuleVisit"("userId");

-- CreateIndex
CREATE INDEX "ModuleVisit_moduleId_idx" ON "ModuleVisit"("moduleId");

-- CreateIndex
CREATE INDEX "QuizSession_userId_idx" ON "QuizSession"("userId");

-- CreateIndex
CREATE INDEX "QuizAnswer_sessionId_idx" ON "QuizAnswer"("sessionId");

-- CreateIndex
CREATE INDEX "VirtualLabSequence_userId_idx" ON "VirtualLabSequence"("userId");

-- CreateIndex
CREATE INDEX "EvalSession_userId_idx" ON "EvalSession"("userId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleVisit" ADD CONSTRAINT "ModuleVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSession" ADD CONSTRAINT "QuizSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualLabSequence" ADD CONSTRAINT "VirtualLabSequence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalSession" ADD CONSTRAINT "EvalSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
