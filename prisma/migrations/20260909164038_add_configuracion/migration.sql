-- CreateTable
CREATE TABLE "Configuracion" (
    "id" SERIAL NOT NULL,
    "whatsapp" TEXT NOT NULL DEFAULT '+54 342 4 537262',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);
