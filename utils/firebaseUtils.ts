import { authInstance, firestoreInstance } from "@/config/firebase"

/**
 * Checks if the user is authenticated before performing Firestore operations
 * @param operation Function that performs Firestore operations
 * @returns Result of the operation or null if not authenticated
 */
export async function withAuth<T>(operation: () => Promise<T>): Promise<T | null> {
  const currentUser = authInstance.currentUser

  if (!currentUser) {
    console.warn("Attempted to access Firestore without authentication")
    return null
  }

  return operation()
}

/**
 * Creates a test document in Firestore that can be accessed without authentication
 * Useful for testing Firestore connectivity
 */
export async function createTestDocument() {
  try {
    await firestoreInstance
      .collection("test")
      .doc("test")
      .set({
        message: "Test document",
        timestamp: new Date().toISOString(),
        createdBy: authInstance.currentUser?.uid || "anonymous",
      })
    console.log("Test document created successfully")
    return true
  } catch (error) {
    console.error("Error creating test document:", error)
    return false
  }
}

