// This file should be imported first in your app
import firebaseApp from "./firebase"

// Verify Firebase is initialized
if (firebaseApp) {
  console.log("Firebase initialization verified in firebaseInit.ts")
} else {
  console.error("Firebase app is undefined in firebaseInit.ts")
}

export default firebaseApp

