-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" CHAR(40) NOT NULL,
    "name" CHAR(40) NOT NULL,
    "password" CHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "phone_number" CHAR(14),
    "photo_url" CHAR(300),
    "reset_password" CHAR(255),
    "reset_password_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
