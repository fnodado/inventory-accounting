// In services/database/databaseFactory.ts
import { Platform } from 'react-native';

// Check if SQLite is available
const isSQLiteAvailable = async () => {
  try {
    if (Platform.OS === 'web') return false;
    const SQLite = await import('expo-sqlite');
    return !!SQLite.default;
  } catch (error) {
    console.error('SQLite not available:', error);
    return false;
  }
};

// Then in initializeDatabase function:
export async function initializeDatabase(): Promise<StorageType> {
  try {
    // Check if Firestore is enabled and working
    const firestoreEnabled = await isFirestoreEnabled();
    
    if (firestoreEnabled) {
      console.log("Using Firebase Firestore for storage");
      currentStorageType = "firebase";
      await FirestoreService.initialize();
    } else {
      // Check if SQLite is available
      const sqliteAvailable = await isSQLiteAvailable();
      
      if (sqliteAvailable) {
        console.log("Firebase not available, using SQLite for storage");
        currentStorageType = "sqlite";
        await SQLiteService.initialize();
      } else {
        console.log("Neither Firebase nor SQLite available, using in-memory storage");
        currentStorageType = "firebase"; // Default to Firebase but with mock data
      }
    }
    
    return currentStorageType;
  } catch (error) {
    // Default handling
  }
}