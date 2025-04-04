import { getDatabaseService, initializeDatabase } from "./database/databaseFactory"

// Define types for your inventory items
export interface InventoryItem {
  id?: string
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  cost: number
  description?: string
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

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getInventoryItems()
  } catch (error) {
    console.error("Error getting inventory items:", error)
    throw error
  }
}

// Get a single inventory item by ID
export const getInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getInventoryItem(id)
  } catch (error) {
    console.error("Error getting inventory item:", error)
    throw error
  }
}

// Add a new inventory item
export const addInventoryItem = async (
  item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">,
): Promise<string | null> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.addInventoryItem(item)
  } catch (error) {
    console.error("Error adding inventory item:", error)
    throw error
  }
}

// Update an inventory item
export const updateInventoryItem = async (
  id: string,
  item: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.updateInventoryItem(id, item)
  } catch (error) {
    console.error("Error updating inventory item:", error)
    throw error
  }
}

// Delete an inventory item
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.deleteInventoryItem(id)
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    throw error
  }
}

// Get inventory items by category
export const getInventoryItemsByCategory = async (category: string): Promise<InventoryItem[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getInventoryItemsByCategory(category)
  } catch (error) {
    console.error("Error getting inventory items by category:", error)
    throw error
  }
}

// Get low stock items (quantity below threshold)
export const getLowStockItems = async (threshold = 10): Promise<InventoryItem[]> => {
  try {
    await ensureInitialized()
    const dbService = getDatabaseService()
    return await dbService.getLowStockItems(threshold)
  } catch (error) {
    console.error("Error getting low stock items:", error)
    throw error
  }
}

