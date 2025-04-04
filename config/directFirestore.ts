import firebase from "@react-native-firebase/app"
import firestore from "@react-native-firebase/firestore"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPRZ8QXgeQ76ItG_FK3KsIFmAXsIoygNA",
  authDomain: "inventory-accounting-133db.firebaseapp.com",
  projectId: "inventory-accounting-133db",
  storageBucket: "inventory-accounting-133db.firebasestorage.app",
  messagingSenderId: "802510731005",
  appId: "1:802510731005:web:7f6bbd9a1307970e977094",
  measurementId: "G-QK1W5GQFEL",
  databaseURL: "https://inventory-accounting-133db-default-rtdb.firebaseio.com",
}

// Initialize a separate Firebase instance for direct Firestore access
let directApp
let directFirestore

try {
  // Check if we already have an app with this name
  if (firebase.apps.find((app) => app.name === "directAccess")) {
    directApp = firebase.app("directAccess")
  } else {
    directApp = firebase.initializeApp(firebaseConfig, "directAccess")
  }

  directFirestore = firestore(directApp)
  console.log("Direct Firestore initialized successfully")
} catch (error) {
  console.error("Error initializing direct Firestore:", error)
}

export { directApp, directFirestore }

// Function to test direct Firestore access
export async function testDirectFirestore() {
  try {
    // Try to write to a public test document
    await directFirestore.collection("test").doc("direct-test").set({
      message: "This is a direct test",
      timestamp: new Date().toISOString(),
    })

    // Try to read it back
    const docRef = await directFirestore.collection("test").doc("direct-test").get()

    if (docRef.exists) {
      console.log("Direct Firestore test successful:", docRef.data())
      return {
        success: true,
        data: docRef.data(),
      }
    } else {
      console.log("Direct Firestore document not found")
      return {
        success: false,
        error: "Document not found",
      }
    }
  } catch (error) {
    console.error("Direct Firestore test failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

