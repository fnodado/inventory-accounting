import { Platform } from "react-native"

let firebase: any
let auth: any
let firestore: any

if (Platform.OS === "web") {
  // Import web version
  const webFirebase = require("./firebaseWeb")
  firebase = webFirebase.default
  auth = webFirebase.auth
  firestore = webFirebase.firestore
} else {
  // Import React Native version
  const nativeFirebase = require("./firebase")
  firebase = nativeFirebase.default
  auth = nativeFirebase.authInstance
  firestore = nativeFirebase.firestoreInstance
}

export default firebase
export { auth, firestore }

