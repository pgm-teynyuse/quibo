/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `Book` table. All the data in the column will be lost.
  - The `authors` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Swap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBook` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Swap" DROP CONSTRAINT "Swap_offered_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Swap" DROP CONSTRAINT "Swap_offering_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Swap" DROP CONSTRAINT "Swap_requested_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Swap" DROP CONSTRAINT "Swap_requesting_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_userId_fkey";

-- DropIndex
DROP INDEX "Book_googleId_key";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "book_id",
DROP COLUMN "googleId",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "publishedDate" TEXT,
ADD COLUMN     "thumbnail" TEXT,
DROP COLUMN "authors",
ADD COLUMN     "authors" TEXT[],
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Swap";

-- DropTable
DROP TABLE "UserBook";

-- CreateTable
CREATE TABLE "BookShelf" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookShelf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookShelf" ADD CONSTRAINT "BookShelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookShelf" ADD CONSTRAINT "BookShelf_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
