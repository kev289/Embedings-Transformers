/*
  Warnings:

  - You are about to drop the column `embeddingVector` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `transformedText` on the `Comparison` table. All the data in the column will be lost.
  - You are about to drop the column `word` on the `Comparison` table. All the data in the column will be lost.
  - Added the required column `text` to the `Comparison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vector` to the `Comparison` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comparison` DROP COLUMN `embeddingVector`,
    DROP COLUMN `transformedText`,
    DROP COLUMN `word`,
    ADD COLUMN `text` TEXT NOT NULL,
    ADD COLUMN `transformation` TEXT NULL,
    ADD COLUMN `vector` TEXT NOT NULL;
