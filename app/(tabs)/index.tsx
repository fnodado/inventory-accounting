"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import  { Colors } from "@/constants/Colors"
import { SalesCard } from "@/components/SalesCard"
import { RecentSaleItem } from "@/components/RecentSaleItem"
import { useAuth } from "@/context/AuthContext"
import { FirebaseTest } from "@/components/FirebaseTest"
import { populateMockData } from "@/services/mockDataService"
import { StorageIndicator } from "@/components/StorageIndicator"
import { AuthStatus } from "@/components/AuthStatu" // Add this import

// Mock data for now
const salesData = {
  totalRevenue: 86231.89,
  totalSales: 1223.65,
  activeOrders: 273,
  totalProfit: 21231.89,
}

const recentSales = [
  { id: "1", customer: "Maria Martinez", amount: 450.0, date: "2023-04-01" },
  { id: "2", customer: "Jackson Lee", amount: 320.5, date: "2023-04-02" },
  { id: "3", customer: "Isabella Morgan", amount: 560.75, date: "2023-04-03" },
  { id: "4", customer: "Michael Kim", amount: 210.25, date: "2023-04-04" },
  { id: "5", customer: "Sofia Reyes", amount: 180.0, date: "2023-04-05" },
]

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mockDataStatus, setMockDataStatus] = useState<string | null>(null)

  const handlePopulateMockData = async () => {
    try {
      setLoading(true)
      setMockDataStatus("Adding mock data...")
      await populateMockData()
      setMockDataStatus("Mock data added successfully!")
    } catch (error) {
      console.error("Error adding mock data:", error)
      setMockDataStatus("Error adding mock data. See console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Download Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <StorageIndicator />

      {/* Add the AuthStatus component here */}
      <AuthStatus />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <FirebaseTest />

        <View style={styles.mockDataContainer}>
          <TouchableOpacity style={styles.mockDataButton} onPress={handlePopulateMockData} disabled={loading}>
            <Text style={styles.mockDataButtonText}>{loading ? "Adding Data..." : "Populate Mock Data"}</Text>
          </TouchableOpacity>
          {mockDataStatus && <Text style={styles.mockDataStatus}>{mockDataStatus}</Text>}
        </View>

        <View style={styles.cardsContainer}>
          <SalesCard
            title="Total Revenue"
            value={`$${salesData.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon="cash-outline"
            color={Colors.primary}
          />
          <SalesCard
            title="Total Sales"
            value={`$${salesData.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon="cart-outline"
            color={Colors.secondary}
          />
          <SalesCard
            title="Active Orders"
            value={salesData.activeOrders.toString()}
            icon="list-outline"
            color={Colors.tertiary}
          />
          <SalesCard
            title="Total Profit"
            value={`$${salesData.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon="trending-up-outline"
            color={Colors.success}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Revenue Chart</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          <View style={styles.recentSalesContainer}>
            {recentSales.map((sale) => (
              <RecentSaleItem key={sale.id} sale={sale} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 12,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  mockDataContainer: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  mockDataButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  mockDataButtonText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
  },
  mockDataStatus: {
    marginTop: 8,
    fontFamily: "Inter-Regular",
    color: Colors.text,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: Colors.text,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  placeholderText: {
    color: Colors.gray,
    fontFamily: "Inter-Regular",
  },
  recentSalesContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
})

