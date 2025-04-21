/*
  Warnings:

  - You are about to drop the column `capacity` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_details` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_type` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "capacity",
DROP COLUMN "schedule_details",
DROP COLUMN "schedule_type";

-- AlterTable
ALTER TABLE "EventAgenda" ADD COLUMN     "capacity" TEXT,
ADD COLUMN     "schedule_details" TEXT,
ADD COLUMN     "schedule_type" TEXT NOT NULL DEFAULT 'one-time';
