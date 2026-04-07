-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "howHeard" TEXT,
    "idPhotoFrontUrl" TEXT NOT NULL,
    "idPhotoBackUrl" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numberOfDays" INTEGER NOT NULL,
    "hireType" TEXT NOT NULL,
    "deliveryOption" TEXT NOT NULL,
    "deliveryAddress" TEXT,
    "hireRate" DOUBLE PRECISION NOT NULL,
    "hireFeeTotal" DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bondAmount" DOUBLE PRECISION NOT NULL,
    "totalCharged" DOUBLE PRECISION NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeBondIntentId" TEXT,
    "bondStatus" TEXT NOT NULL DEFAULT 'held',
    "bondCapturedAmount" DOUBLE PRECISION,
    "bondCaptureReason" TEXT,
    "termsAcceptedAt" TIMESTAMP(3),
    "signatureDataUrl" TEXT,
    "pickupChecklist" TEXT,
    "returnChecklist" TEXT,
    "adminNotes" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "dailyRate" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "weekendRate" DOUBLE PRECISION NOT NULL DEFAULT 350,
    "weeklyRate" DOUBLE PRECISION NOT NULL DEFAULT 600,
    "bondAmount" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "deliveryRadius" INTEGER NOT NULL DEFAULT 30,
    "businessName" TEXT NOT NULL DEFAULT 'Split It Gold Coast',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "pickupSuburb" TEXT NOT NULL DEFAULT 'Mudgeeraba',
    "pickupInstructions" TEXT NOT NULL DEFAULT '',
    "returnInstructions" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
