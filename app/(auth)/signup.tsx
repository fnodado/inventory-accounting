"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { Link, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useAuth } from "@/context/AuthContext"

export default function SignupScreen() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const { signUp } = useAuth()

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match")
      return
    }

    if (!agreeToTerms) {
      console.error("You must agree to the terms")
      return
    }

    try {
      await signUp(email, password, fullName)
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image />
            <Text style={styles.logoText}>Inventory & Accounting</Text>
          </View>

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Enter your information to create an account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. John Smith" value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.gray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
            <View style={styles.checkbox}>
              {agreeToTerms && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
            </View>
            <Text style={styles.termsText}>I accept the Terms of Service & Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signupButton, !agreeToTerms && styles.disabledButton]}
            onPress={handleSignup}
            disabled={!agreeToTerms}
          >
            <Text style={styles.signupButtonText}>Create account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: Colors.text,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    height: 44,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  eyeIcon: {
    padding: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    flex: 1,
  },
  signupButton: {
    backgroundColor: Colors.black,
    height: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: Colors.primary,
  },
})

