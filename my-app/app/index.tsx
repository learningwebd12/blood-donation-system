import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        router.replace("/(home)/home");
      } else {
        router.replace("/(auth)/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#e63946" />
      <Text style={{ marginTop: 10 }}>Donate Blood ❤️ Save Life</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
