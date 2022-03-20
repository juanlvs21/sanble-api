-- CreateEnum
CREATE TYPE "FairType" AS ENUM ('ENTREPRENEURSHIP', 'GASTRONOMIC');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CANDY', 'FOOD', 'CLOTHING', 'DRINK', 'ACCESSORY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "username" VARCHAR(40) NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "emailVerified_At" TIMESTAMP(3),
    "phoneNumber" VARCHAR(14),
    "photoUrl" VARCHAR(300) DEFAULT E'https://ik.imagekit.io/sanble/avatar_SMHFRa-Afo.png',
    "resetPassword" VARCHAR(255),
    "resetPasswordAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fair" (
    "id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "emailContact" VARCHAR(40),
    "phoneContact" VARCHAR(14),
    "address" VARCHAR(255) NOT NULL,
    "dateTime" TIMESTAMP(3),
    "lat" VARCHAR(15),
    "lng" VARCHAR(15),
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
    "photoUrl" VARCHAR(300) NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fairId" UUID NOT NULL,

    CONSTRAINT "Photograph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stand" (
    "id" UUID NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "slogan" VARCHAR(255),
    "stars" INTEGER NOT NULL DEFAULT 0,
    "emailContact" VARCHAR(40),
    "phoneContact" VARCHAR(14),
    "photoUrl" VARCHAR(300) DEFAULT E'https://ik.imagekit.io/sanble/no-image_LHuW5V1nj.png',
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
    "name" VARCHAR(40) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "price" DECIMAL NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "scorers" INTEGER NOT NULL DEFAULT 0,
    "type" "ProductType" NOT NULL,
    "photoUrl" VARCHAR(300) DEFAULT E'https://ik.imagekit.io/sanble/no-image_LHuW5V1nj.png',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "standId" UUID NOT NULL,
    "promotionId" UUID NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" UUID NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "photoUrl" VARCHAR(300) DEFAULT E'https://ik.imagekit.io/sanble/no-image_LHuW5V1nj.png',
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
