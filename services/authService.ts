import { authInstance as auth } from "@/config/firebase"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Key for storing user data in AsyncStorage
const USER_STORAGE_KEY = "auth_user_data"

// User type definition
export interface User {
  id: string
  email: string | null
  name: string | null
}

// Get the current user from AsyncStorage
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_STORAGE_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Save user data to AsyncStorage
export const saveUserData = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.error("Error saving user data:", error)
  }
}

// Clear user data from AsyncStorage
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing user data:", error)
  }
}

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Create user with email and password
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)

    // Update profile with display name
    await userCredential.user.updateProfile({
      displayName: name,
    })

    // Create user object
    const user: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      name: name,
    }

    // Save user data to AsyncStorage
    await saveUserData(user)

    return user
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    // Sign in with email and password
    const userCredential = await auth.signInWithEmailAndPassword(email, password)

    // Create user object
    const user: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName,
    }

    // Save user data to AsyncStorage
    await saveUserData(user)

    return user
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    // Sign out from Firebase
    await auth.signOut()

    // Clear user data from AsyncStorage
    await clearUserData()
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

