-- CreateEnum
CREATE TYPE "FairType" AS ENUM ('ENTREPRENEURSHIP', 'GASTRONOMIC');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CANDY', 'FOOD', 'CLOTHING', 'DRINK', 'ACCESSORY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" CHAR(40) NOT NULL,
    "username" CHAR(40) NOT NULL,
    "name" CHAR(40) NOT NULL,
    "password" CHAR(255) NOT NULL,
    "emailVerified_At" TIMESTAMP(3),
    "phoneNumber" CHAR(14),
    "photoUrl" CHAR(300),
    "resetPassword" CHAR(255),
    "resetPasswordAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fair" (
    "id" UUID NOT NULL,
    "name" CHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "emailContact" CHAR(40),
    "phoneNumber" CHAR(14),
    "address" CHAR(255) NOT NULL,
    "dateTime" TIMESTAMP(3),
    "lat" CHAR(15),
    "lng" CHAR(15),
    "stars" INTEGER NOT NULL DEFAULT 0,
    "type" "FairType" NOT NULL DEFAULT E'ENTREPRENEURSHIP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Fair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photograph" (
    "id" UUID NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "photoUrl" CHAR(300),
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fairId" UUID NOT NULL,

    CONSTRAINT "Photograph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stand" (
    "id" UUID NOT NULL,
    "name" CHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "slogan" VARCHAR(255),
    "stars" INTEGER NOT NULL DEFAULT 0,
    "photoUrl" CHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandsOnFairs" (
    "fairId" UUID NOT NULL,
    "standId" UUID NOT NULL,

    CONSTRAINT "StandsOnFairs_pkey" PRIMARY KEY ("fairId","standId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" CHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "price" DECIMAL NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "scorers" INTEGER NOT NULL DEFAULT 0,
    "type" "ProductType" NOT NULL,
    "photoUrl" CHAR(300),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "standId" UUID NOT NULL,
    "promotionId" UUID NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" UUID NOT NULL,
    "title" CHAR(80) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "photoUrl" CHAR(300),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "standId" UUID NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Fair" ADD CONSTRAINT "Fair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photograph" ADD CONSTRAINT "Photograph_fairId_fkey" FOREIGN KEY ("fairId") REFERENCES "Fair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandsOnFairs" ADD CONSTRAINT "StandsOnFairs_fairId_fkey" FOREIGN KEY ("fairId") REFERENCES "Fair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandsOnFairs" ADD CONSTRAINT "StandsOnFairs_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
