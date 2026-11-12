import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { db } from "../../../../db";
import { products, orders, orderItems, storeSettings } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.use(healthRouter);

router.get("/products", async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, customerCity, customerAddress, paymentMethod, items } = req.body;
    
    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const orderNumber = `ORD-${Date.now()}`;

    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      paymentMethod,
      subtotal,
      status: "pending"
    }).returning();

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productName: item.productName,
        reference: item.reference,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      });
    }

    res.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { name, brand, reference, price, cost, stock, category, audience, description, concentration, size, isFeatured, status } = req.body;
    
    const [newProduct] = await db.insert(products).values({
      name, brand, reference, price: Number(price), stock: Number(stock), category, audience, description, concentration, size, isFeatured, cost
    }).returning();

    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, reference, price, cost, stock, category, audience, description, concentration, size, isFeatured, status } = req.body;
    
    const [updatedProduct] = await db.update(products).set({
      name, brand, reference, price: Number(price), cost: Number(cost), stock: Number(stock), category, audience, description, concentration, size, isFeatured, status
    }).where(eq(products.id, Number(id))).returning();

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const ordersWithItems = await Promise.all(allOrders.map(async (order) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }));
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 1. Obtener el pedido actual para saber qué productos tiene
    const [currentOrder] = await db.select().from(orders).where(eq(orders.id, Number(id)));
    if (!currentOrder) return res.status(404).json({ error: "Pedido no encontrado" });

    // 2. Si el nuevo estado es "shipped" (Enviado) y antes no lo era, restamos el stock
    if (status === "shipped" && currentOrder.status !== "shipped") {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, Number(id)));
      
      for (const item of items) {
        // Buscar el producto por referencia y restar el stock
        const [product] = await db.select().from(products).where(eq(products.reference, item.reference));
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await db.update(products).set({ stock: newStock }).where(eq(products.id, product.id));
        }
      }
    }

    // 3. Actualizar el estado del pedido
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, Number(id))).returning();
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error al actualizar el pedido" });
  }
});

router.put("/products/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    const [updatedProduct] = await db.update(products)
      .set({ stock: Number(stock) })
      .where(eq(products.id, Number(id)))
      .returning();
      
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Error al actualizar el inventario" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await db.select().from(storeSettings);
    res.json(settings[0] || null);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { whatsappMain, whatsappSecondary, nequiNumber, bankAccount, deliveryInfo } = req.body; // <-- Agregado bankAccount
    
    const existing = await db.select().from(storeSettings);
    
    if (existing.length > 0) {
      const [updated] = await db.update(storeSettings).set({
        whatsappMain, 
        whatsappSecondary, 
        nequiNumber, 
        bankAccount, // <-- Agregado aquí
        deliveryInfo, 
        updatedAt: new Date()
      }).where(eq(storeSettings.id, existing[0].id)).returning();
      return res.json(updated);
    } else {
      const [created] = await db.insert(storeSettings).values({
        whatsappMain, 
        whatsappSecondary, 
        nequiNumber, 
        bankAccount, // <-- Agregado aquí
        deliveryInfo
      }).returning();
      return res.json(created);
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
});

export default router;