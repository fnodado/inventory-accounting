import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color={Colors.gray} />
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>The page you're looking for doesn't exist or has been moved.</Text>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
})

