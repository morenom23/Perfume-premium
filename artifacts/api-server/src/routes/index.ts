import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { db } from "../../../../db";
import { products, orders, orderItems } from "../../../../db/schema";
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
    const { name, brand, reference, price, stock, category, audience, description, concentration, size, isFeatured, status } = req.body;
    
    const [newProduct] = await db.insert(products).values({
      name, brand, reference, price: Number(price), stock: Number(stock), category, audience, description, concentration, size, isFeatured, status
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
    const { name, brand, reference, price, stock, category, audience, description, concentration, size, isFeatured, status } = req.body;
    
    const [updatedProduct] = await db.update(products).set({
      name, brand, reference, price: Number(price), stock: Number(stock), category, audience, description, concentration, size, isFeatured, status
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
    
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, Number(id))).returning();
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error al actualizar el pedido" });
  }
});

export default router;