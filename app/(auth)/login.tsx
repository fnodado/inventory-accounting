"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native"
import { Link, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useAuth } from "@/context/AuthContext"
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email) {
      setError('Please enter your email');
      return false;
    }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setError('');

    try {
    //   await signIn(email, password)

    
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image />
          <Text style={styles.logoText}>Inventory & Accounting</Text>
        </View>

        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account</Text>

        {error && (
            <Alert variant="destructive" style={styles.errorAlert}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Privacy Statement</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.privacyText}>Email: admin@example.com • Password: password</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: Colors.primary,
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
  loginButton: {
    backgroundColor: Colors.black,
    height: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: Colors.primary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
  },
  privacyText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    textAlign: "center",
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
})

