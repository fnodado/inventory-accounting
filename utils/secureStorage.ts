import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

// Fallback for web platform
const memoryStorage = new Map<string, string>()

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return memoryStorage.get(key) || null
    }
    return await SecureStore.getItemAsync(key)
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      memoryStorage.set(key, value)
      return
    }
    await SecureStore.setItemAsync(key, value)
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      memoryStorage.delete(key)
      return
    }
    await SecureStore.deleteItemAsync(key)
  },
}

