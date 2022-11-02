-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('UI', 'UX', 'ENHANCEMENT', 'BUG', 'FEATURE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('PLANNED', 'LIVE', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
