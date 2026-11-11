import { pgTable, serial, text, integer, timestamp, boolean, varchar, decimal } from "drizzle-orm/pg-core";

// Tabla de Administradores
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("secondary"), // "owner" o "secondary"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Productos
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  reference: varchar("reference", { length: 100 }).notNull().unique(),
  price: integer("price").notNull(), // Precio en COP
  cost: integer("cost"), // Costo interno (privado)
  stock: integer("stock").notNull().default(0),
  category: varchar("category", { length: 100 }).notNull(),
  audience: varchar("audience", { length: 50 }).notNull(),
  description: text("description"),
  concentration: varchar("concentration", { length: 50 }),
  size: varchar("size", { length: 50 }),
  isFeatured: boolean("is_featured").default(false),
  status: varchar("status", { length: 50 }).notNull().default("published"), // "published", "draft", "out_of_stock"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Pedidos
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerCity: varchar("customer_city", { length: 100 }).notNull(),
  customerAddress: text("customer_address").notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
  subtotal: integer("subtotal").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pendiente, confirmado, pagado, enviado, entregado, cancelado
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de Detalle de Pedidos
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  reference: varchar("reference", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  subtotal: integer("subtotal").notNull(),
});