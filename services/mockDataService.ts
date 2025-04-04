import { firestoreInstance as firestore } from "@/config/firebase"
import firebase from "@react-native-firebase/app"
import { withAuth } from "@/utils/firebaseUtils"

// Function to populate the database with mock data
export const populateMockData = async () => {
  return (
    withAuth(async () => {
      try {
        console.log("Populating mock data...")

        // Add mock inventory items
        const inventoryItems = [
          {
            name: "Laptop",
            sku: "TECH-001",
            category: "Electronics",
            quantity: 15,
            price: 999.99,
            cost: 750.0,
            description: "High-performance laptop with 16GB RAM and 512GB SSD",
          },
          {
            name: "Desk Chair",
            sku: "FURN-002",
            category: "Furniture",
            quantity: 8,
            price: 199.99,
            cost: 120.0,
            description: "Ergonomic office chair with lumbar support",
          },
          {
            name: "Wireless Mouse",
            sku: "TECH-003",
            category: "Electronics",
            quantity: 25,
            price: 29.99,
            cost: 15.0,
            description: "Bluetooth wireless mouse with long battery life",
          },
          {
            name: "Coffee Maker",
            sku: "APPL-004",
            category: "Appliances",
            quantity: 5,
            price: 79.99,
            cost: 45.0,
            description: "Programmable coffee maker with 12-cup capacity",
          },
          {
            name: "Desk Lamp",
            sku: "FURN-005",
            category: "Furniture",
            quantity: 12,
            price: 39.99,
            cost: 22.0,
            description: "LED desk lamp with adjustable brightness",
          },
        ]

        // Add each inventory item to Firestore
        for (const item of inventoryItems) {
          const docRef = await firestore.collection("inventory").add({
            ...item,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          console.log(`Added inventory item with ID: ${docRef.id}`)
        }

        // Add mock orders
        const orders = [
          {
            customerName: "John Smith",
            customerEmail: "john@example.com",
            items: [
              {
                productId: "TECH-001",
                productName: "Laptop",
                quantity: 1,
                price: 999.99,
                total: 999.99,
              },
            ],
            subtotal: 999.99,
            tax: 80.0,
            total: 1079.99,
            status: "completed",
            paymentStatus: "paid",
          },
          {
            customerName: "Sarah Johnson",
            customerEmail: "sarah@example.com",
            items: [
              {
                productId: "FURN-002",
                productName: "Desk Chair",
                quantity: 2,
                price: 199.99,
                total: 399.98,
              },
              {
                productId: "FURN-005",
                productName: "Desk Lamp",
                quantity: 1,
                price: 39.99,
                total: 39.99,
              },
            ],
            subtotal: 439.97,
            tax: 35.2,
            total: 475.17,
            status: "processing",
            paymentStatus: "paid",
          },
          {
            customerName: "Michael Brown",
            customerEmail: "michael@example.com",
            items: [
              {
                productId: "TECH-003",
                productName: "Wireless Mouse",
                quantity: 3,
                price: 29.99,
                total: 89.97,
              },
            ],
            subtotal: 89.97,
            tax: 7.2,
            total: 97.17,
            status: "pending",
            paymentStatus: "unpaid",
          },
        ]

        // Add each order to Firestore
        for (const order of orders) {
          const docRef = await firestore.collection("orders").add({
            ...order,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          console.log(`Added order with ID: ${docRef.id}`)
        }

        // Create a public test document that can be accessed without authentication
        await firestore.collection("test").doc("test").set({
          message: "This is a public test document",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        console.log("Mock data population complete!")
        return true
      } catch (error) {
        console.error("Error populating mock data:", error)
        throw error
      }
    }) || false
  )
}

