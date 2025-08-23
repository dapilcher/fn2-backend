-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "slug" SET DEFAULT '';
