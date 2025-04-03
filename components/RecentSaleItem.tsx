import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface Sale {
  id: string
  customer: string
  amount: number
  date: string
}

interface RecentSaleItemProps {
  sale: Sale
}

export function RecentSaleItem({ sale }: RecentSaleItemProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="person-outline" size={16} color={Colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.customerName}>{sale.customer}</Text>
        <Text style={styles.date}>{formatDate(sale.date)}</Text>
      </View>
      <Text style={styles.amount}>${sale.amount.toFixed(2)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
  },
  amount: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: Colors.success,
  },
})

