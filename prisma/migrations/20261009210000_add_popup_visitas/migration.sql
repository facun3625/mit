Loaded Prisma config from prisma.config.ts.

-- CreateTable
CREATE TABLE "Popup" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "contenido" TEXT NOT NULL DEFAULT '',
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "frecuencia" TEXT NOT NULL DEFAULT 'UNA_VEZ',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Popup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopupVista" (
    "id" SERIAL NOT NULL,
    "popupId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PopupVista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "referrer" TEXT,
    "refHost" TEXT,
    "fuente" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "pais" TEXT,
    "region" TEXT,
    "ciudad" TEXT,
    "dispositivo" TEXT NOT NULL,
    "navegador" TEXT NOT NULL,
    "sistema" TEXT NOT NULL,
    "idioma" TEXT,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PopupVista_popupId_version_ipHash_key" ON "PopupVista"("popupId", "version", "ipHash");

-- CreateIndex
CREATE INDEX "Visita_createdAt_idx" ON "Visita"("createdAt");

-- CreateIndex
CREATE INDEX "Visita_path_createdAt_idx" ON "Visita"("path", "createdAt");

-- CreateIndex
CREATE INDEX "Visita_sessionId_idx" ON "Visita"("sessionId");

-- CreateIndex
CREATE INDEX "Visita_visitorId_idx" ON "Visita"("visitorId");

-- AddForeignKey
ALTER TABLE "PopupVista" ADD CONSTRAINT "PopupVista_popupId_fkey" FOREIGN KEY ("popupId") REFERENCES "Popup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

