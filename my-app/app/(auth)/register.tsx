import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      
      await AsyncStorage.setItem("showRegisterToast", "true");

     
      router.replace("/(auth)/login");

    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainLogin}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Create Account</Text>

        <TextInput style={styles.userInput}  placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.userInput} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.userInput} placeholder="Phone" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.userInput} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


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
  loginButton: {
    backgroundColor: "#e63946",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
