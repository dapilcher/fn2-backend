-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "headerImage" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "altText" TEXT NOT NULL DEFAULT '',
    "image_id" TEXT,
    "image_filesize" INTEGER,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_extension" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_headerImage_idx" ON "Post"("headerImage");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_headerImage_fkey" FOREIGN KEY ("headerImage") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
