import { firestoreInstance } from "@/config/firebase"

export async function isFirestoreEnabled(): Promise<boolean> {
  try {
    // Try to access a test collection
    const testCollection = firestoreInstance.collection("firestore_api_check")

    // Try to get documents (this will fail if the API is not enabled)
    await testCollection.limit(1).get()

    // If we get here, Firestore is enabled
    return true
  } catch (error: any) {
    // Check if the error is about the API not being enabled
    if (error.message.includes("API has not been used") || error.message.includes("it is disabled")) {
      console.log("Firestore API is not enabled")
      return false
    }

    // If it's a different error, Firestore might still be enabled
    console.error("Error checking if Firestore is enabled:", error)
    return false
  }
}

export function getFirestoreEnableUrl(): string {
  return "https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=inventory-accounting-133db"
}

