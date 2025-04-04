import * as SQLite from "expo-sqlite"
import * as Crypto from "expo-crypto"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Key for storing user data in AsyncStorage for quick access
const USER_STORAGE_KEY = "auth_user_data"

// User type definition
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

// Open the database
const db = SQLite.openDatabase("inventory_accounting.db")

// Initialize the database by creating the users table if it doesn't exist
export const initializeAuthDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`,
        [],
        () => {
          console.log("Users table created or already exists")
          resolve()
        },
        (_, error) => {
          console.error("Error creating users table:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Hash a password using SHA-256
const hashPassword = async (password: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password)
  return hash
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
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (_, result) => {
          resolve(result.rows.length > 0)
        },
        (_, error) => {
          console.error("Error checking if user exists:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

// Sign up a new user
export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Initialize the database if needed
    await initializeAuthDatabase()

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

    // Create the user in the database
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
          [id, email, name, passwordHash, createdAt],
          (_, result) => {
            if (result.rowsAffected > 0) {
              // Create user object
              const user: User = {
                id,
                email,
                name,
                createdAt,
              }

              // Save user data to AsyncStorage
              saveUserData(user)

              resolve(user)
            } else {
              reject(new Error("Failed to create user"))
            }
          },
          (_, error) => {
            console.error("Error creating user:", error)
            reject(error)
            return false
          },
        )
      })
    })
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

// Sign in a user
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    // Initialize the database if needed
    await initializeAuthDatabase()

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Check if user exists and password matches
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (_, result) => {
            if (result.rows.length > 0) {
              const user = result.rows.item(0)

              // Check if password matches
              if (user.password_hash === passwordHash) {
                // Create user object
                const userData: User = {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  createdAt: user.created_at,
                }

                // Save user data to AsyncStorage
                saveUserData(userData)

                resolve(userData)
              } else {
                reject(new Error("Incorrect password"))
              }
            } else {
              reject(new Error("No user found with this email"))
            }
          },
          (_, error) => {
            console.error("Error signing in:", error)
            reject(error)
            return false
          },
        )
      })
    })
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
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const user = result.rows.item(0)
            resolve({
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.created_at,
            })
          } else {
            resolve(null)
          }
        },
        (_, error) => {
          console.error("Error getting user by ID:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

// Add demo users if they don't exist
export const addDemoUsers = async (): Promise<void> => {
  try {
    // Initialize the database if needed
    await initializeAuthDatabase()

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

        // Create the user in the database
        await new Promise<void>((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
              [id, demoUser.email, demoUser.name, passwordHash, createdAt],
              () => {
                console.log(`Demo user created: ${demoUser.email}`)
                resolve()
              },
              (_, error) => {
                console.error(`Error creating demo user ${demoUser.email}:`, error)
                reject(error)
                return false
              },
            )
          })
        })
      }
    }
  } catch (error) {
    console.error("Error adding demo users:", error)
  }
}

