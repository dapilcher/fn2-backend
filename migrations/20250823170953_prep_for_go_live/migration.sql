/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN "slug" TEXT;

UPDATE "Tag"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(name, '^[^A-Za-z0-9]+|[^A-Za-z0-9]+$', '', 'g'),
    '[^A-Za-z0-9]+', '-', 'g')
  )
;

ALTER TABLE "Tag" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
