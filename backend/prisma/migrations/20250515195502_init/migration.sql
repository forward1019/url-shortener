-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortSlug_key" ON "Link"("shortSlug");
