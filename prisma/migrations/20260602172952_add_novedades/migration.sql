-- CreateTable
CREATE TABLE "CategoriaNoticia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#00b3a4',

    CONSTRAINT "CategoriaNoticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novedad" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenDestacada" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" INTEGER,

    CONSTRAINT "Novedad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaNoticia_nombre_key" ON "CategoriaNoticia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaNoticia_slug_key" ON "CategoriaNoticia"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Novedad_slug_key" ON "Novedad"("slug");

-- AddForeignKey
ALTER TABLE "Novedad" ADD CONSTRAINT "Novedad_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaNoticia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
