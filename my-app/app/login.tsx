import { Link } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from "react-native";

const Login = () => {
  return (
    
    <KeyboardAvoidingView 
      style={styles.mainLogin}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Welcome to Blood Care!</Text>
        <Text style={styles.subTitle}>Enter your Mobile number and password to login</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.userInput}
            placeholder="98XXXXXXXX"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.userInput}
            placeholder="Enter your Password"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Link href={"/register"} asChild>
        <Pressable>
          <Text>Don&apos;t have an account ? Signup</Text>
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