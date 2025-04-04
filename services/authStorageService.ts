import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Crypto from "expo-crypto"

// Keys for storing data in AsyncStorage
const USER_STORAGE_KEY = "auth_user_data"
const USERS_STORAGE_KEY = "auth_users_data"

// User type definition
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

// User with password for storage
interface StoredUser extends User {
  passwordHash: string
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Hash a password using SHA-256
const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password)
    return hash
  } catch (error) {
    console.error("Error hashing password:", error)
    // Fallback to a simple hash if crypto fails
    return password
      .split("")
      .reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) | 0
      }, 0)
      .toString()
  }
}

// Initialize the users storage
export const initializeAuthStorage = async (): Promise<void> => {
  try {
    // Check if users storage exists
    const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY)

    if (!usersData) {
      // Create empty users array
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]))
      console.log("Users storage initialized")

      // Add demo users
      await addDemoUsers()
    }
  } catch (error) {
    console.error("Error initializing auth storage:", error)
  }
}

// Get all users
const getAllUsers = async (): Promise<StoredUser[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY)
    return usersData ? JSON.parse(usersData) : []
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

// Save all users
const saveAllUsers = async (users: StoredUser[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving all users:", error)
  }
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

// Check if a user with the given email exists
export const userExists = async (email: string): Promise<boolean> => {
  try {
    const users = await getAllUsers()
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  } catch (error) {
    console.error("Error checking if user exists:", error)
    return false
  }
}

// Sign up a new user
export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Initialize storage if needed
    await initializeAuthStorage()

    // Check if user already exists
    const exists = await userExists(email)
    if (exists) {
      throw new Error("A user with this email already exists")
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Generate a unique ID
    const id = generateId()

    // Get current timestamp
    const createdAt = new Date().toISOString()

    // Create the user object
    const newUser: StoredUser = {
      id,
      email,
      name,
      createdAt,
      passwordHash,
    }

    // Get all users and add the new one
    const users = await getAllUsers()
    users.push(newUser)

    // Save all users
    await saveAllUsers(users)

    // Create user object without password hash
    const user: User = {
      id,
      email,
      name,
      createdAt,
    }

    // Save current user data
    await saveUserData(user)

    return user
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

// Sign in a user
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    // Initialize storage if needed
    await initializeAuthStorage()

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Get all users
    const users = await getAllUsers()

    // Find the user with the given email
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error("No user found with this email")
    }

    // Check if password matches
    if (user.passwordHash !== passwordHash) {
      throw new Error("Incorrect password")
    }

    // Create user object without password hash
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }

    // Save current user data
    await saveUserData(userData)

    return userData
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    // Clear user data from AsyncStorage
    await clearUserData()
  } catch (error) {
    console.error("Sign out error:", error)
    throw error
  }
}

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const users = await getAllUsers()
    const user = users.find((u) => u.id === id)

    if (!user) {
      return null
    }

    // Return user without password hash
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Add demo users if they don't exist
export const addDemoUsers = async (): Promise<void> => {
  try {
    const demoUsers = [
      { email: "admin@example.com", password: "password", name: "Admin User" },
      { email: "admin@gmail.com", password: "admin", name: "Demo Admin" },
    ]

    for (const demoUser of demoUsers) {
      // Check if user already exists
      const exists = await userExists(demoUser.email)

      if (!exists) {
        // Hash the password
        const passwordHash = await hashPassword(demoUser.password)

        // Generate a unique ID
        const id = generateId()

        // Get current timestamp
        const createdAt = new Date().toISOString()

        // Create the user object
        const newUser: StoredUser = {
          id,
          email: demoUser.email,
          name: demoUser.name,
          createdAt,
          passwordHash,
        }

        // Get all users and add the new one
        const users = await getAllUsers()
        users.push(newUser)

        // Save all users
        await saveAllUsers(users)

        console.log(`Demo user created: ${demoUser.email}`)
      }
    }
  } catch (error) {
    console.error("Error adding demo users:", error)
  }
}

