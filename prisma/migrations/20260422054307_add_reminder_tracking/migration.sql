-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pickupReminderSentAt" TIMESTAMP(3),
ADD COLUMN     "returnReminderSentAt" TIMESTAMP(3);
