/*
  Warnings:

  - You are about to drop the column `ISBN` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `pub_date` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authors` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_owner_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "ISBN",
DROP COLUMN "author",
DROP COLUMN "condition",
DROP COLUMN "genre",
DROP COLUMN "owner_id",
DROP COLUMN "pub_date",
ADD COLUMN     "authors" TEXT NOT NULL,
ADD COLUMN     "googleId" TEXT NOT NULL,
ADD COLUMN     "isbn" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserBook" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "UserBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBook_userId_bookId_key" ON "UserBook"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_googleId_key" ON "Book"("googleId");

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;
