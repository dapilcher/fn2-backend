-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "folder" TEXT;

-- CreateTable
CREATE TABLE "ImageFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ImageFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Image_folder_idx" ON "Image"("folder");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_folder_fkey" FOREIGN KEY ("folder") REFERENCES "ImageFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
