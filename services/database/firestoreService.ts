import { firestoreInstance } from "@/config/firebase"
import firebase from "@react-native-firebase/app"
import type { InventoryItem } from "../inventoryService"
import type { Order } from "../orderService"

/**
 * Initialize Firestore
 */
export async function initialize(): Promise<void> {
  // Firestore is already initialized in the firebase.ts file
  // This function is here for consistency with the SQLite service
  console.log("Firestore service initialized")
}

// INVENTORY OPERATIONS

/**
 * Get all inventory items
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  try {
    const querySnapshot = await firestoreInstance.collection("inventory").get()
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<InventoryItem, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting inventory items:", error)
    throw error
  }
}

/**
 * Get a single inventory item by ID
 */
export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  try {
    const docSnap = await firestoreInstance.collection("inventory").doc(id).get()

    if (docSnap.exists) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...(data as Omit<InventoryItem, "id" | "createdAt" | "updatedAt">),
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting inventory item:", error)
    throw error
  }
}

/**
 * Add a new inventory item
 */
export async function addInventoryItem(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const now = firebase.firestore.FieldValue.serverTimestamp()
    const docRef = await firestoreInstance.collection("inventory").add({
      ...item,
      createdAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding inventory item:", error)
    throw error
  }
}

/**
 * Update an inventory item
 */
export async function updateInventoryItem(
  id: string,
  item: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  try {
    await firestoreInstance
      .collection("inventory")
      .doc(id)
      .update({
        ...item,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    return true
  } catch (error) {
    console.error("Error updating inventory item:", error)
    throw error
  }
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    await firestoreInstance.collection("inventory").doc(id).delete()
    return true
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    throw error
  }
}

/**
 * Get inventory items by category
 */
export async function getInventoryItemsByCategory(category: string): Promise<InventoryItem[]> {
  try {
    const querySnapshot = await firestoreInstance.collection("inventory").where("category", "==", category).get()

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<InventoryItem, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting inventory items by category:", error)
    throw error
  }
}

/**
 * Get low stock items (quantity below threshold)
 */
export async function getLowStockItems(threshold = 10): Promise<InventoryItem[]> {
  try {
    const querySnapshot = await firestoreInstance.collection("inventory").where("quantity", "<", threshold).get()

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<InventoryItem, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting low stock items:", error)
    throw error
  }
}

// ORDER OPERATIONS

/**
 * Get all orders
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const querySnapshot = await firestoreInstance.collection("orders").get()
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<Order, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting orders:", error)
    throw error
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  try {
    const docSnap = await firestoreInstance.collection("orders").doc(id).get()

    if (docSnap.exists) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...(data as Omit<Order, "id" | "createdAt" | "updatedAt">),
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting order:", error)
    throw error
  }
}

/**
 * Add a new order
 */
export async function addOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const now = firebase.firestore.FieldValue.serverTimestamp()
    const docRef = await firestoreInstance.collection("orders").add({
      ...order,
      createdAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding order:", error)
    throw error
  }
}

/**
 * Update an order
 */
export async function updateOrder(
  id: string,
  order: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  try {
    await firestoreInstance
      .collection("orders")
      .doc(id)
      .update({
        ...order,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    return true
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

/**
 * Delete an order
 */
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await firestoreInstance.collection("orders").doc(id).delete()
    return true
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limitCount = 5): Promise<Order[]> {
  try {
    const querySnapshot = await firestoreInstance
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get()

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<Order, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting recent orders:", error)
    throw error
  }
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
  try {
    const querySnapshot = await firestoreInstance.collection("orders").where("status", "==", status).get()

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...(data as Omit<Order, "id" | "createdAt" | "updatedAt">),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      }
    })
  } catch (error) {
    console.error("Error getting orders by status:", error)
    throw error
  }
}

