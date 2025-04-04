// For web platform
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
export const auth = firebase.auth()
export const firestore = firebase.firestore()

