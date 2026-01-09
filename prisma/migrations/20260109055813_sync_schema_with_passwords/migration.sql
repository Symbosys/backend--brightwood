/*
  Warnings:

  - A unique constraint covering the columns `[parentsLoginId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loginId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherLoginId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `parent` ADD COLUMN `parentsLoginId` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `loginId` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `teacherLoginId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Parent_parentsLoginId_key` ON `Parent`(`parentsLoginId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_loginId_key` ON `Student`(`loginId`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_teacherLoginId_key` ON `Teacher`(`teacherLoginId`);
