/*
  Warnings:

  - You are about to drop the column `capacity` on the `EventAgenda` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_details` on the `EventAgenda` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_type` on the `EventAgenda` table. All the data in the column will be lost.
  - You are about to drop the column `is_free` on the `Ticket` table. All the data in the column will be lost.
  - Made the column `location_details` on table `EventSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location_type` on table `EventSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EventAgenda" DROP COLUMN "capacity",
DROP COLUMN "schedule_details",
DROP COLUMN "schedule_type";

-- AlterTable
ALTER TABLE "EventSchedule" ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "location_details" SET NOT NULL,
ALTER COLUMN "location_type" SET NOT NULL,
ALTER COLUMN "location_type" SET DEFAULT 'Physical';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "is_free",
ALTER COLUMN "ticket_name" DROP NOT NULL,
ALTER COLUMN "ticket_type" SET DEFAULT 'free';
