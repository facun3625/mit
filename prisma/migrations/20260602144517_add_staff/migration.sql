-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "foto" TEXT,
    "texto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sede" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorEspecialidad" (
    "doctorId" INTEGER NOT NULL,
    "especialidadId" INTEGER NOT NULL,

    CONSTRAINT "DoctorEspecialidad_pkey" PRIMARY KEY ("doctorId","especialidadId")
);

-- CreateTable
CREATE TABLE "DoctorSede" (
    "doctorId" INTEGER NOT NULL,
    "sedeId" INTEGER NOT NULL,

    CONSTRAINT "DoctorSede_pkey" PRIMARY KEY ("doctorId","sedeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_nombre_key" ON "Sede"("nombre");

-- AddForeignKey
ALTER TABLE "DoctorEspecialidad" ADD CONSTRAINT "DoctorEspecialidad_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorEspecialidad" ADD CONSTRAINT "DoctorEspecialidad_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSede" ADD CONSTRAINT "DoctorSede_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSede" ADD CONSTRAINT "DoctorSede_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
