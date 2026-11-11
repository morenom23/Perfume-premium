import { db } from "./db";
import { products } from "./db/schema";
import * as dotenv from "dotenv";

dotenv.config();

const demoData = [
  { name: "Noche Violeta", brand: "Tu Perfumería", reference: "DEMO-001", price: 189000, stock: 8, category: "Oriental", audience: "Unisex", description: "Una composición de demostración profunda, envolvente y luminosa.", concentration: "EDP", size: "100 ml", isFeatured: true, status: "published" },
  { name: "Luz Mineral", brand: "Tu Perfumería", reference: "DEMO-002", price: 154000, stock: 12, category: "Fresca", audience: "Mujer", description: "Frescura mineral para el día a día.", concentration: "EDT", size: "75 ml", isFeatured: true, status: "published" },
  { name: "Jardín Eléctrico", brand: "Tu Perfumería", reference: "DEMO-003", price: 172000, stock: 5, category: "Floral", audience: "Mujer", description: "Un ramo floral con un toque eléctrico.", concentration: "EDP", size: "100 ml", isFeatured: true, status: "published" },
  { name: "Madera Líquida", brand: "Tu Perfumería", reference: "DEMO-005", price: 216000, stock: 3, category: "Amaderada", audience: "Hombre", description: "Maderas profundas y resinas.", concentration: "Parfum", size: "100 ml", isFeatured: true, status: "published" },
  { name: "Ámbar de Medianoche", brand: "Tu Perfumería", reference: "DEMO-007", price: 195000, stock: 10, category: "Oriental", audience: "Hombre", description: "Ámbar cálido para la noche.", concentration: "EDP", size: "100 ml", isFeatured: false, status: "published" },
  { name: "Vainilla Orbital", brand: "Tu Perfumería", reference: "DEMO-008", price: 167000, stock: 15, category: "Dulce", audience: "Unisex", description: "Vainilla suave y envolvente.", concentration: "EDT", size: "100 ml", isFeatured: false, status: "published" },
  { name: "Cítrico Solar", brand: "Tu Perfumería", reference: "DEMO-004", price: 172000, stock: 20, category: "Cítrica", audience: "Unisex", description: "Energía cítrica pura.", concentration: "EDC", size: "100 ml", isFeatured: false, status: "published" },
  { name: "Nube de Té", brand: "Tu Perfumería", reference: "DEMO-006", price: 198000, stock: 7, category: "Fresca", audience: "Mujer", description: "Té verde y notas limpias.", concentration: "EDP", size: "100 ml", isFeatured: false, status: "published" },
  // Puedes agregar los 4 restantes aquí si quieres
];

async function seedProducts() {
  console.log("Insertando productos en Neon...");
  try {
    for (const item of demoData) {
      await db.insert(products).values(item).onConflictDoNothing();
    }
    console.log("✅ Productos insertados exitosamente.");
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

seedProducts();