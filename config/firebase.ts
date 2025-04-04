// Import the Firebase modules correctly
import firebase from "@react-native-firebase/app"

// Your complete Firebase configuration with databaseURL
const firebaseConfig = {
  apiKey: "AIzaSyBPRZ8QXgeQ76ItG_FK3KsIFmAXsIoygNA",
  authDomain: "inventory-accounting-133db.firebaseapp.com",
  projectId: "inventory-accounting-133db",
  storageBucket: "inventory-accounting-133db.firebasestorage.app",
  messagingSenderId: "802510731005",
  appId: "1:802510731005:web:7f6bbd9a1307970e977094",
  measurementId: "G-QK1W5GQFEL",
  // Add the databaseURL - this is required for some Firebase services
  databaseURL: "https://inventory-accounting-133db-default-rtdb.firebaseio.com",
}

// Initialize Firebase with a more robust approach
let firebaseApp

try {
  console.log("Initializing Firebase...")

  if (!firebase.apps.length) {
    firebaseApp = firebase.initializeApp(firebaseConfig)
    console.log("Firebase initialized successfully with app name:", firebaseApp.name)
  } else {
    firebaseApp = firebase.app()
    console.log("Using existing Firebase app:", firebaseApp.name)
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  throw new Error(`Failed to initialize Firebase: ${error}`)
}

// Now import the Firebase services AFTER initialization
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

// Export the initialized app and services
export default firebaseApp
export const authInstance = auth()

// Export Firestore with error handling
let firestoreInstance
try {
  firestoreInstance = firestore()
  console.log("Firestore initialized successfully")
} catch (error) {
  console.error("Firestore initialization error:", error)
  // Create a mock Firestore instance that logs errors
  firestoreInstance = {
    collection: (collectionPath) => {
      console.warn(`Firestore API not enabled. Attempted to access collection: ${collectionPath}`)
      return {
        doc: (docPath) => {
          console.warn(`Firestore API not enabled. Attempted to access document: ${docPath}`)
          return {
            get: async () => {
              throw new Error("Firestore API not enabled. Please enable it in the Google Cloud Console.")
            },
            set: async () => {
              throw new Error("Firestore API not enabled. Please enable it in the Google Cloud Console.")
            },
          }
        },
        add: async () => {
          throw new Error("Firestore API not enabled. Please enable it in the Google Cloud Console.")
        },
        get: async () => {
          throw new Error("Firestore API not enabled. Please enable it in the Google Cloud Console.")
        },
      }
    },
  }
}

export { firestoreInstance }

// Log successful exports
console.log("Firebase services exported successfully")

