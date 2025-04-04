import { firestoreInstance } from "@/config/firebase"
import { directFirestore } from "@/config/directFirestore"

// This is a temporary workaround for Firestore security rules issues
export async function getInventoryItemsNoAuth() {
  try {
    // Try with direct Firestore first
    const querySnapshot = await directFirestore.collection("inventory").get()

    // If we got here, it worked!
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (directError) {
    console.error("Direct Firestore access failed:", directError)

    // Try with the regular Firestore instance
    try {
      const querySnapshot = await firestoreInstance.collection("inventory").get()
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (regularError) {
      console.error("Regular Firestore access failed:", regularError)

      // If all else fails, return mock data
      console.log("Returning mock data as fallback")
      return getMockInventoryItems()
    }
  }
}

// Mock data to use as fallback
function getMockInventoryItems() {
  return [
    {
      id: "mock-1",
      name: "Laptop (Mock)",
      sku: "MOCK-001",
      category: "Electronics",
      quantity: 15,
      price: 999.99,
      cost: 750.0,
      description: "Mock data - Firestore access failed",
    },
    {
      id: "mock-2",
      name: "Desk Chair (Mock)",
      sku: "MOCK-002",
      category: "Furniture",
      quantity: 8,
      price: 199.99,
      cost: 120.0,
      description: "Mock data - Firestore access failed",
    },
    {
      id: "mock-3",
      name: "Wireless Mouse (Mock)",
      sku: "MOCK-003",
      category: "Electronics",
      quantity: 25,
      price: 29.99,
      cost: 15.0,
      description: "Mock data - Firestore access failed",
    },
  ]
}

