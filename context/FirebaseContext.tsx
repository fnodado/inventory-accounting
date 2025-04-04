"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import firebase from "@/config/firebase"

interface FirebaseContextType {
  isInitialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({ isInitialized: false })

export function useFirebase() {
  return useContext(FirebaseContext)
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Simple test to check if Firebase is working
        await firebase.app().options
        console.log("Firebase is initialized and working")
        setIsInitialized(true)
      } catch (error) {
        console.error("Firebase initialization check failed:", error)
        // Try to initialize again if it failed
        try {
          if (!firebase.apps.length) {
            firebase.initializeApp({
              apiKey: "AIzaSyBPRZ8QXgeQ76ItG_FK3KsIFmAXsIoygNA",
              authDomain: "inventory-accounting-133db.firebaseapp.com",
              projectId: "inventory-accounting-133db",
              storageBucket: "inventory-accounting-133db.firebasestorage.app",
              messagingSenderId: "802510731005",
              appId: "1:802510731005:web:7f6bbd9a1307970e977094",
              measurementId: "G-QK1W5GQFEL",
            })
            console.log("Firebase re-initialized successfully")
            setIsInitialized(true)
          }
        } catch (reinitError) {
          console.error("Firebase re-initialization failed:", reinitError)
        }
      }
    }

    checkFirebase()
  }, [])

  return <FirebaseContext.Provider value={{ isInitialized }}>{children}</FirebaseContext.Provider>
}

