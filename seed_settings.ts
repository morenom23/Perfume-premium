import { db } from "./db";
import { storeSettings } from "./db/schema";
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    await db.insert(storeSettings).values({
      whatsappMain: "573001234567",
      nequiNumber: "3001234567",
      deliveryInfo: "Tus productos llegarán aproximadamente entre 3 y 4 días hábiles después de haber confirmado el pedido."
    });
    console.log("✅ Configuración inicial creada.");
  } catch (error) {
    console.log("La configuración ya existe o hubo un error:", error);
  }
  process.exit(0);
}

seed();