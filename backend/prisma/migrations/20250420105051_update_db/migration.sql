/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `approvalStatus` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `bannerImage` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImage` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isVirtual` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `virtualMeetingLink` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `virtualMeetingPassword` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EventImage` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `EventImage` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `EventImage` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `EventImage` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `EventImage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `speaker` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EventSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingCountry` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingFirstName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingLastName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingState` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIntentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `ticketTypeId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `checkedIn` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `checkedInAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketNumber` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketTypeId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EventAttendee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order_number]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `event_id` to the `EventImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `EventImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `EventSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_name` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_type` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendee" DROP CONSTRAINT "EventAttendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventImage" DROP CONSTRAINT "EventImage_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSchedule" DROP CONSTRAINT "EventSchedule_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTag" DROP CONSTRAINT "EventTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_eventId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_eventId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Order_orderNumber_key";

-- DropIndex
DROP INDEX "Ticket_ticketNumber_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "address",
DROP COLUMN "approvalStatus",
DROP COLUMN "bannerImage",
DROP COLUMN "categoryId",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "featuredImage",
DROP COLUMN "isFeatured",
DROP COLUMN "isFree",
DROP COLUMN "isPublic",
DROP COLUMN "isVirtual",
DROP COLUMN "latitude",
DROP COLUMN "locationName",
DROP COLUMN "longitude",
DROP COLUMN "organizerId",
DROP COLUMN "postalCode",
DROP COLUMN "shortDescription",
DROP COLUMN "startDate",
DROP COLUMN "state",
DROP COLUMN "status",
DROP COLUMN "timezone",
DROP COLUMN "updatedAt",
DROP COLUMN "viewCount",
DROP COLUMN "virtualMeetingLink",
DROP COLUMN "virtualMeetingPassword",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "schedule_details" TEXT,
ADD COLUMN     "schedule_type" TEXT NOT NULL DEFAULT 'one-time',
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "capacity" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EventImage" DROP COLUMN "createdAt",
DROP COLUMN "displayOrder",
DROP COLUMN "eventId",
DROP COLUMN "imageUrl",
DROP COLUMN "isPrimary",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventSchedule" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "endTime",
DROP COLUMN "eventId",
DROP COLUMN "location",
DROP COLUMN "speaker",
DROP COLUMN "startTime",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "day" TEXT NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "location_details" TEXT,
ADD COLUMN     "location_type" TEXT,
ADD COLUMN     "start_time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddress",
DROP COLUMN "billingCity",
DROP COLUMN "billingCountry",
DROP COLUMN "billingEmail",
DROP COLUMN "billingFirstName",
DROP COLUMN "billingLastName",
DROP COLUMN "billingPostalCode",
DROP COLUMN "billingState",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "orderNumber",
DROP COLUMN "paymentIntentId",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "order_number" TEXT NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "orderId",
DROP COLUMN "ticketTypeId",
DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice",
ADD COLUMN     "order_id" INTEGER NOT NULL,
ADD COLUMN     "ticket_id" INTEGER NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "checkedIn",
DROP COLUMN "checkedInAt",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "eventId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "orderId",
DROP COLUMN "qrCode",
DROP COLUMN "status",
DROP COLUMN "ticketNumber",
DROP COLUMN "ticketTypeId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "ticket_name" TEXT NOT NULL,
ADD COLUMN     "ticket_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "fullName",
DROP COLUMN "isVerified",
DROP COLUMN "passwordHash",
DROP COLUMN "phone",
DROP COLUMN "profileImage",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiresAt",
DROP COLUMN "updatedAt",
DROP COLUMN "verificationToken",
ADD COLUMN     "account_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "account_token" TEXT,
ADD COLUMN     "account_type" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "EventAttendee";

-- DropTable
DROP TABLE "EventTag";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TicketType";

-- DropTable
DROP TABLE "UserFavorite";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "EventAgenda" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "speakers" TEXT,
    "time" TEXT,

    CONSTRAINT "EventAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "ticket_id" INTEGER,
    "comment" TEXT,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourite" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventImage" ADD CONSTRAINT "EventImage_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAgenda" ADD CONSTRAINT "EventAgenda_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
