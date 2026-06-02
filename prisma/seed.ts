import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const especialidades = [
  "Cardiología", "Cirugía cardiovascular", "Clínica Médica",
  "Gastroenterología clínica", "Ginecología", "Infectología",
  "Nefrología", "Nefrología pediátrica", "Neurología", "Neumonología",
  "Especialidades pediátricas", "Traumatología", "Urología",
  "Cirugía general", "Cirugía Torácica", "Cirugía plástica",
  "Gastroenterología endoscópica", "Hepatología", "Endocrinología",
  "Oncología", "Psicología", "Nutrición", "Hemodinamia",
  "Terapia intensiva", "Trasplante renal", "Trasplante hepático",
  "Trasplante cardíaco", "Cirugía abdominal", "Neurocirugía",
];

const sedes = [
  "Sanatorio Central",
  "Consultorios MIT",
  "Centro de Imágenes y Laboratorio",
  "Unidad de Trasplante",
  "Unidad de Diálisis Peritoneal",
  "IEP — Especialidades Pediátricas",
  "Centro Médico Las Acacias",
  "Administración Central",
];

async function main() {
  // Admin user
  const email = process.env.ADMIN_EMAIL ?? "admin@grupomit.com";
  const password = process.env.ADMIN_PASSWORD ?? "Mit2025!";
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed, name: "Administrador MIT", role: "admin" },
  });
  console.log(`✓ Admin: ${email}`);

  // Especialidades
  for (const nombre of especialidades) {
    await prisma.especialidad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log(`✓ ${especialidades.length} especialidades`);

  // Sedes
  for (const nombre of sedes) {
    await prisma.sede.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log(`✓ ${sedes.length} sedes`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
