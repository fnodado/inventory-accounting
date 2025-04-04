import * as SQLite from "expo-sqlite"
import type { InventoryItem } from "../inventoryService"
import type { Order } from "../orderService"

// Database connection
let db: SQLite.SQLiteDatabase | null = null

/**
 * Initialize the SQLite database
 */
export async function initialize(): Promise<void> {
  try {
    // Open the database
    db = SQLite.openDatabase("inventory_accounting.db")

    // Create tables if they don't exist
    await createTables()

    console.log("SQLite database initialized successfully")
  } catch (error) {
    console.error("Error initializing SQLite database:", error)
    throw error
  }
}

/**
 * Create the necessary tables in the database
 */
async function createTables(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    // Create inventory table
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inventory (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          sku TEXT NOT NULL,
          category TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          cost REAL NOT NULL,
          description TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )`,
        [],
        () => {
          // Create orders table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS orders (
              id TEXT PRIMARY KEY,
              customerId TEXT,
              customerName TEXT NOT NULL,
              customerEmail TEXT,
              subtotal REAL NOT NULL,
              tax REAL NOT NULL,
              total REAL NOT NULL,
              status TEXT NOT NULL,
              paymentStatus TEXT NOT NULL,
              createdAt TEXT,
              updatedAt TEXT
            )`,
            [],
            () => {
              // Create order items table
              tx.executeSql(
                `CREATE TABLE IF NOT EXISTS order_items (
                  id TEXT PRIMARY KEY,
                  orderId TEXT NOT NULL,
                  productId TEXT NOT NULL,
                  productName TEXT NOT NULL,
                  quantity INTEGER NOT NULL,
                  price REAL NOT NULL,
                  total REAL NOT NULL,
                  FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
                )`,
                [],
                () => resolve(),
                (_, error) => {
                  console.error("Error creating order_items table:", error)
                  reject(error)
                  return false
                },
              )
            },
            (_, error) => {
              console.error("Error creating orders table:", error)
              reject(error)
              return false
            },
          )
        },
        (_, error) => {
          console.error("Error creating inventory table:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

// Generate a unique ID (similar to Firestore's auto-generated IDs)
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Format date for SQLite
function formatDate(date: Date | undefined): string | null {
  return date ? date.toISOString() : null
}

// Parse date from SQLite
function parseDate(dateString: string | null): Date | undefined {
  return dateString ? new Date(dateString) : undefined
}

// INVENTORY OPERATIONS

/**
 * Get all inventory items
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM inventory",
        [],
        (_, { rows }) => {
          const items: InventoryItem[] = []
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i)
            items.push({
              id: item.id,
              name: item.name,
              sku: item.sku,
              category: item.category,
              quantity: item.quantity,
              price: item.price,
              cost: item.cost,
              description: item.description,
              createdAt: parseDate(item.createdAt),
              updatedAt: parseDate(item.updatedAt),
            })
          }
          resolve(items)
        },
        (_, error) => {
          console.error("Error getting inventory items:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get a single inventory item by ID
 */
export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM inventory WHERE id = ?",
        [id],
        (_, { rows }) => {
          if (rows.length === 0) {
            resolve(null)
            return
          }

          const item = rows.item(0)
          resolve({
            id: item.id,
            name: item.name,
            sku: item.sku,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            cost: item.cost,
            description: item.description,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt),
          })
        },
        (_, error) => {
          console.error("Error getting inventory item:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Add a new inventory item
 */
export async function addInventoryItem(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    const id = generateId()
    const now = new Date()

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO inventory (
          id, name, sku, category, quantity, price, cost, description, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          item.name,
          item.sku,
          item.category,
          item.quantity,
          item.price,
          item.cost,
          item.description || null,
          formatDate(now),
          formatDate(now),
        ],
        () => {
          resolve(id)
        },
        (_, error) => {
          console.error("Error adding inventory item:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Update an inventory item
 */
export async function updateInventoryItem(
  id: string,
  item: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    // Get the current item first to merge with updates
    getInventoryItem(id)
      .then((existingItem) => {
        if (!existingItem) {
          reject(new Error(`Inventory item with ID ${id} not found`))
          return
        }

        // Build the SET clause and parameters for the SQL query
        const updates: string[] = []
        const params: any[] = []

        if (item.name !== undefined) {
          updates.push("name = ?")
          params.push(item.name)
        }

        if (item.sku !== undefined) {
          updates.push("sku = ?")
          params.push(item.sku)
        }

        if (item.category !== undefined) {
          updates.push("category = ?")
          params.push(item.category)
        }

        if (item.quantity !== undefined) {
          updates.push("quantity = ?")
          params.push(item.quantity)
        }

        if (item.price !== undefined) {
          updates.push("price = ?")
          params.push(item.price)
        }

        if (item.cost !== undefined) {
          updates.push("cost = ?")
          params.push(item.cost)
        }

        if (item.description !== undefined) {
          updates.push("description = ?")
          params.push(item.description)
        }

        // Always update the updatedAt timestamp
        updates.push("updatedAt = ?")
        params.push(formatDate(new Date()))

        // Add the ID as the last parameter
        params.push(id)

        // Execute the update query
        db.transaction((tx) => {
          tx.executeSql(
            `UPDATE inventory SET ${updates.join(", ")} WHERE id = ?`,
            params,
            (_, { rowsAffected }) => {
              resolve(rowsAffected > 0)
            },
            (_, error) => {
              console.error("Error updating inventory item:", error)
              reject(error)
              return false
            },
          )
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM inventory WHERE id = ?",
        [id],
        (_, { rowsAffected }) => {
          resolve(rowsAffected > 0)
        },
        (_, error) => {
          console.error("Error deleting inventory item:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get inventory items by category
 */
export async function getInventoryItemsByCategory(category: string): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM inventory WHERE category = ?",
        [category],
        (_, { rows }) => {
          const items: InventoryItem[] = []
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i)
            items.push({
              id: item.id,
              name: item.name,
              sku: item.sku,
              category: item.category,
              quantity: item.quantity,
              price: item.price,
              cost: item.cost,
              description: item.description,
              createdAt: parseDate(item.createdAt),
              updatedAt: parseDate(item.updatedAt),
            })
          }
          resolve(items)
        },
        (_, error) => {
          console.error("Error getting inventory items by category:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get low stock items (quantity below threshold)
 */
export async function getLowStockItems(threshold = 10): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM inventory WHERE quantity < ?",
        [threshold],
        (_, { rows }) => {
          const items: InventoryItem[] = []
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i)
            items.push({
              id: item.id,
              name: item.name,
              sku: item.sku,
              category: item.category,
              quantity: item.quantity,
              price: item.price,
              cost: item.cost,
              description: item.description,
              createdAt: parseDate(item.createdAt),
              updatedAt: parseDate(item.updatedAt),
            })
          }
          resolve(items)
        },
        (_, error) => {
          console.error("Error getting low stock items:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

// ORDER OPERATIONS

/**
 * Get all orders
 */
export async function getOrders(): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders",
        [],
        (_, { rows }) => {
          const orders: Order[] = []

          // Process each order
          const processOrder = (index: number) => {
            if (index >= rows.length) {
              resolve(orders)
              return
            }

            const order = rows.item(index)

            // Get the order items for this order
            tx.executeSql(
              "SELECT * FROM order_items WHERE orderId = ?",
              [order.id],
              (_, { rows: itemRows }) => {
                const items = []
                for (let i = 0; i < itemRows.length; i++) {
                  const item = itemRows.item(i)
                  items.push({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                  })
                }

                orders.push({
                  id: order.id,
                  customerId: order.customerId,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  items: items,
                  subtotal: order.subtotal,
                  tax: order.tax,
                  total: order.total,
                  status: order.status as any,
                  paymentStatus: order.paymentStatus as any,
                  createdAt: parseDate(order.createdAt),
                  updatedAt: parseDate(order.updatedAt),
                })

                // Process the next order
                processOrder(index + 1)
              },
              (_, error) => {
                console.error("Error getting order items:", error)
                reject(error)
                return false
              },
            )
          }

          // Start processing orders
          if (rows.length > 0) {
            processOrder(0)
          } else {
            resolve([])
          }
        },
        (_, error) => {
          console.error("Error getting orders:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders WHERE id = ?",
        [id],
        (_, { rows }) => {
          if (rows.length === 0) {
            resolve(null)
            return
          }

          const order = rows.item(0)

          // Get the order items
          tx.executeSql(
            "SELECT * FROM order_items WHERE orderId = ?",
            [id],
            (_, { rows: itemRows }) => {
              const items = []
              for (let i = 0; i < itemRows.length; i++) {
                const item = itemRows.item(i)
                items.push({
                  productId: item.productId,
                  productName: item.productName,
                  quantity: item.quantity,
                  price: item.price,
                  total: item.total,
                })
              }

              resolve({
                id: order.id,
                customerId: order.customerId,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                items: items,
                subtotal: order.subtotal,
                tax: order.tax,
                total: order.total,
                status: order.status as any,
                paymentStatus: order.paymentStatus as any,
                createdAt: parseDate(order.createdAt),
                updatedAt: parseDate(order.updatedAt),
              })
            },
            (_, error) => {
              console.error("Error getting order items:", error)
              reject(error)
              return false
            },
          )
        },
        (_, error) => {
          console.error("Error getting order:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Add a new order
 */
export async function addOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    const id = generateId()
    const now = new Date()

    db.transaction((tx) => {
      // Insert the order
      tx.executeSql(
        `INSERT INTO orders (
          id, customerId, customerName, customerEmail, subtotal, tax, total, 
          status, paymentStatus, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          order.customerId || null,
          order.customerName,
          order.customerEmail || null,
          order.subtotal,
          order.tax,
          order.total,
          order.status,
          order.paymentStatus,
          formatDate(now),
          formatDate(now),
        ],
        () => {
          // Insert the order items
          const insertItems = (index: number) => {
            if (index >= order.items.length) {
              resolve(id)
              return
            }

            const item = order.items[index]
            const itemId = generateId()

            tx.executeSql(
              `INSERT INTO order_items (
                id, orderId, productId, productName, quantity, price, total
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [itemId, id, item.productId, item.productName, item.quantity, item.price, item.total],
              () => {
                insertItems(index + 1)
              },
              (_, error) => {
                console.error("Error adding order item:", error)
                reject(error)
                return false
              },
            )
          }

          if (order.items.length > 0) {
            insertItems(0)
          } else {
            resolve(id)
          }
        },
        (_, error) => {
          console.error("Error adding order:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Update an order
 */
export async function updateOrder(
  id: string,
  order: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    // Get the current order first
    getOrder(id)
      .then((existingOrder) => {
        if (!existingOrder) {
          reject(new Error(`Order with ID ${id} not found`))
          return
        }

        db.transaction((tx) => {
          // Build the SET clause and parameters for the SQL query
          const updates: string[] = []
          const params: any[] = []

          if (order.customerId !== undefined) {
            updates.push("customerId = ?")
            params.push(order.customerId)
          }

          if (order.customerName !== undefined) {
            updates.push("customerName = ?")
            params.push(order.customerName)
          }

          if (order.customerEmail !== undefined) {
            updates.push("customerEmail = ?")
            params.push(order.customerEmail)
          }

          if (order.subtotal !== undefined) {
            updates.push("subtotal = ?")
            params.push(order.subtotal)
          }

          if (order.tax !== undefined) {
            updates.push("tax = ?")
            params.push(order.tax)
          }

          if (order.total !== undefined) {
            updates.push("total = ?")
            params.push(order.total)
          }

          if (order.status !== undefined) {
            updates.push("status = ?")
            params.push(order.status)
          }

          if (order.paymentStatus !== undefined) {
            updates.push("paymentStatus = ?")
            params.push(order.paymentStatus)
          }

          // Always update the updatedAt timestamp
          updates.push("updatedAt = ?")
          params.push(formatDate(new Date()))

          // Add the ID as the last parameter
          params.push(id)

          // Update the order
          tx.executeSql(
            `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
            params,
            (_, { rowsAffected }) => {
              // If there are no items to update, we're done
              if (!order.items) {
                resolve(rowsAffected > 0)
                return
              }

              // If there are items to update, delete the existing items and insert the new ones
              tx.executeSql(
                "DELETE FROM order_items WHERE orderId = ?",
                [id],
                () => {
                  // Insert the new items
                  const insertItems = (index: number) => {
                    if (index >= order.items!.length) {
                      resolve(true)
                      return
                    }

                    const item = order.items![index]
                    const itemId = generateId()

                    tx.executeSql(
                      `INSERT INTO order_items (
                      id, orderId, productId, productName, quantity, price, total
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [itemId, id, item.productId, item.productName, item.quantity, item.price, item.total],
                      () => {
                        insertItems(index + 1)
                      },
                      (_, error) => {
                        console.error("Error adding order item:", error)
                        reject(error)
                        return false
                      },
                    )
                  }

                  if (order.items!.length > 0) {
                    insertItems(0)
                  } else {
                    resolve(true)
                  }
                },
                (_, error) => {
                  console.error("Error deleting order items:", error)
                  reject(error)
                  return false
                },
              )
            },
            (_, error) => {
              console.error("Error updating order:", error)
              reject(error)
              return false
            },
          )
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * Delete an order
 */
export async function deleteOrder(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      // Delete the order items first (due to foreign key constraint)
      tx.executeSql(
        "DELETE FROM order_items WHERE orderId = ?",
        [id],
        () => {
          // Then delete the order
          tx.executeSql(
            "DELETE FROM orders WHERE id = ?",
            [id],
            (_, { rowsAffected }) => {
              resolve(rowsAffected > 0)
            },
            (_, error) => {
              console.error("Error deleting order:", error)
              reject(error)
              return false
            },
          )
        },
        (_, error) => {
          console.error("Error deleting order items:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limitCount = 5): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders ORDER BY createdAt DESC LIMIT ?",
        [limitCount],
        (_, { rows }) => {
          const orders: Order[] = []

          // Process each order
          const processOrder = (index: number) => {
            if (index >= rows.length) {
              resolve(orders)
              return
            }

            const order = rows.item(index)

            // Get the order items for this order
            tx.executeSql(
              "SELECT * FROM order_items WHERE orderId = ?",
              [order.id],
              (_, { rows: itemRows }) => {
                const items = []
                for (let i = 0; i < itemRows.length; i++) {
                  const item = itemRows.item(i)
                  items.push({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                  })
                }

                orders.push({
                  id: order.id,
                  customerId: order.customerId,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  items: items,
                  subtotal: order.subtotal,
                  tax: order.tax,
                  total: order.total,
                  status: order.status as any,
                  paymentStatus: order.paymentStatus as any,
                  createdAt: parseDate(order.createdAt),
                  updatedAt: parseDate(order.updatedAt),
                })

                // Process the next order
                processOrder(index + 1)
              },
              (_, error) => {
                console.error("Error getting order items:", error)
                reject(error)
                return false
              },
            )
          }

          // Start processing orders
          if (rows.length > 0) {
            processOrder(0)
          } else {
            resolve([])
          }
        },
        (_, error) => {
          console.error("Error getting recent orders:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"))
      return
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders WHERE status = ?",
        [status],
        (_, { rows }) => {
          const orders: Order[] = []

          // Process each order
          const processOrder = (index: number) => {
            if (index >= rows.length) {
              resolve(orders)
              return
            }

            const order = rows.item(index)

            // Get the order items for this order
            tx.executeSql(
              "SELECT * FROM order_items WHERE orderId = ?",
              [order.id],
              (_, { rows: itemRows }) => {
                const items = []
                for (let i = 0; i < itemRows.length; i++) {
                  const item = itemRows.item(i)
                  items.push({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                  })
                }

                orders.push({
                  id: order.id,
                  customerId: order.customerId,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  items: items,
                  subtotal: order.subtotal,
                  tax: order.tax,
                  total: order.total,
                  status: order.status as any,
                  paymentStatus: order.paymentStatus as any,
                  createdAt: parseDate(order.createdAt),
                  updatedAt: parseDate(order.updatedAt),
                })

                // Process the next order
                processOrder(index + 1)
              },
              (_, error) => {
                console.error("Error getting order items:", error)
                reject(error)
                return false
              },
            )
          }

          // Start processing orders
          if (rows.length > 0) {
            processOrder(0)
          } else {
            resolve([])
          }
        },
        (_, error) => {
          console.error("Error getting orders by status:", error)
          reject(error)
          return false
        },
      )
    })
  })
}

