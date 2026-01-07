import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useState,useEffect } from "react";
import Toast from "react-native-toast-message";


const Login = () => {
  const router = useRouter(); // ✅ router for navigation

    useEffect(() => {
    const showRegisterToast = async () => {
      const flag = await AsyncStorage.getItem("showRegisterToast");

      if (flag === "true") {
        Toast.show({
          type: "success",
          text1: "Account Created 🎉",
          text2: "Please login to continue",
        });

        await AsyncStorage.removeItem("showRegisterToast");
      }
    };

    showRegisterToast();
  }, []);


  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phone || !password) {
      
      return;
    }

    try {
      const res = await fetch("http://192.168.1.74:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message);
        return;
      }

      // ✅ SAVE TOKEN & USER
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged in user:", data.user);

      Alert.alert("Success", "Login successful");
await AsyncStorage.setItem("showLoginToast", "true");

      // ✅ REDIRECT TO HOME (NOT index)
      router.replace("/home");

    } catch (error) {
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainLogin}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Welcome to Blood Care!</Text>
        <Text style={styles.subTitle}>
          Enter your Mobile number and password to login
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.userInput}
            placeholder="98XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.userInput}
            placeholder="Enter your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Link href="/auth/register" asChild>
          <Pressable>
            <Text style={{ textAlign: "center" }}>
              Don&apos;t have an account ? Signup
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainLogin: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e63946",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  userInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#e63946",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#e63946",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
