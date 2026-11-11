import { db } from "./db";
import { admins } from "./db/schema";
import { hash } from "bcryptjs"; // Nota: usaremos bcryptjs luego
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("Creando usuario propietario...");
  
  // Por ahora, para avanzar rápido y probar, lo haremos sin encriptar.
  // En el siguiente paso instalaremos bcryptjs y lo cambiaremos.
  const email = "admin@tuperfumeria.com";
  const password = "Admin123!"; // Luego la cambiaremos por hash

  try {
    await db.insert(admins).values({
      email: email,
      passwordHash: password, // Esto es temporal
      role: "owner",
      isActive: true,
    });
    console.log("✅ Usuario creado exitosamente:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error al crear el usuario (puede que ya exista):", error);
  }
  process.exit(0);
}

seed();