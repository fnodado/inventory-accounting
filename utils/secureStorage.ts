import * as SecureStore from "expo-secure-store"

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}

async function getValueFor(key: string) {
  const result = await SecureStore.getItemAsync(key)
  return result
}

async function deleteValueFor(key: string) {
  await SecureStore.deleteItemAsync(key)
}

export const secureStorage = {
  save,
  getValueFor,
  deleteValueFor,
}

