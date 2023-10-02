-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "blurb" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "headerImage" JSONB,
ADD COLUMN     "headerImageAttribution" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "headerImageAttributionUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL DEFAULT '',
    "headerImage" JSONB,
    "headerImageAttribution" TEXT NOT NULL DEFAULT '',
    "headerImageAttributionUrl" TEXT NOT NULL DEFAULT '',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_title_key" ON "Page"("title");
