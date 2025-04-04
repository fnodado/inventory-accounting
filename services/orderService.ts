import { getDatabaseService, initializeDatabase } from "./database/databaseFactory"

// Define types for your orders
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id?: string
  customerId?: string
  customerName: string
  customerEmail?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "unpaid" | "paid" | "refunded"
  createdAt?: Date
  updatedAt?: Date
}

// Initialize the database on first import
let initialized = false
const ensureInitialized = async () => {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getOrders()
  } catch (error) {
    console.error("Error getting orders:", error)
    throw error
  }
}

// Get a single order by ID
export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getOrder(id)
  } catch (error) {
    console.error("Error getting order:", error)
    throw error
  }
}

// Add a new order
export const addOrder = async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.addOrder(order)
  } catch (error) {
    console.error("Error adding order:", error)
    throw error
  }
}

// Update an order
export const updateOrder = async (
  id: string,
  order: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>,
): Promise<void> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    await dbService.updateOrder(id, order)
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    await dbService.deleteOrder(id)
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

// Get recent orders
export const getRecentOrders = async (limitCount = 5): Promise<Order[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getRecentOrders(limitCount)
  } catch (error) {
    console.error("Error getting recent orders:", error)
    throw error
  }
}

// Get orders by status
export const getOrdersByStatus = async (status: Order["status"]): Promise<Order[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getOrdersByStatus(status)
  } catch (error) {
    console.error("Error getting orders by status:", error)
    throw error
  }
}

