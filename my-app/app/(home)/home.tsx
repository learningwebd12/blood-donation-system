import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState("Home");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Show welcome toast whenever user logs in
  useEffect(() => {
    const showWelcomeToast = async () => {
      if (!user) return; // only show when user exists

      const showLoginToast = await AsyncStorage.getItem("showLoginToast");
      if (showLoginToast === "true") {
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: `Welcome, ${user.name} 👋`,
          position: "top",
          visibilityTime: 3000,
        });
        await AsyncStorage.removeItem("showLoginToast");
      }
    };
    showWelcomeToast();
  }, [user]); // run whenever user changes

  // Logout function
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // context handles clearing user and redirect
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout Error:", error);
      Toast.show({
        type: "error",
        text1: "Logout failed",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show nothing until user is loaded
  if (!user) return null;

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>LifeStream</Text>
          <Text style={styles.brandSubtitle}>SAVE A LIFE TODAY</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutIconBtn}
          disabled={isLoggingOut}
        >
          <FontAwesome5
            name={isLoggingOut ? "spinner" : "power-off"}
            size={16}
            color="#dc2626"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <FontAwesome5 name="user-alt" size={20} color="white" />
              </View>
              <View>
                <Text style={styles.helloText}>Hello, {user.name}</Text>
                
              </View>
            </View>

            <View style={styles.statusBox}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusLabel}>ELIGIBILITY</Text>
                <FontAwesome5 name="check-circle" size={14} color="#10b981" />
              </View>
              <Text style={styles.statusDescription}>
                You are eligible to donate! Your blood can save up to 3 people.
              </Text>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.grid}>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[styles.iconBg, { backgroundColor: "#eff6ff" }]}
              >
                <FontAwesome5 name="search" size={18} color="#2563eb" />
              </View>
              <Text style={styles.actionLabel}>Find Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[styles.iconBg, { backgroundColor: "#fff7ed" }]}
              >
                <FontAwesome5 name="plus" size={18} color="#ea580c" />
              </View>
              <Text style={styles.actionLabel}>Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => setCurrentTab("Home")}
          style={styles.navItem}
        >
          <FontAwesome5
            name="home"
            size={20}
            color={currentTab === "Home" ? "#ef4444" : "#9ca3af"}
          />
          <Text
            style={[styles.navText, currentTab === "Home" && styles.navTextActive]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab("Search")}
          style={styles.navItem}
        >
          <FontAwesome5
            name="search"
            size={20}
            color={currentTab === "Search" ? "#ef4444" : "#9ca3af"}
          />
          <Text
            style={[styles.navText, currentTab === "Search" && styles.navTextActive]}
          >
            Find
          </Text>
        </TouchableOpacity>

        <View style={styles.centralCircle}>
          <FontAwesome5 name="tint" size={24} color="white" />
        </View>

        <TouchableOpacity
          onPress={() => setCurrentTab("Profile")}
          style={styles.navItem}
        >
          <FontAwesome5
            name="user-circle"
            size={20}
            color={currentTab === "Profile" ? "#ef4444" : "#9ca3af"}
          />
          <Text
            style={[
              styles.navText,
              currentTab === "Profile" && styles.navTextActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab("Menu")}
          style={styles.navItem}
        >
          <FontAwesome5
            name="bars"
            size={20}
            color={currentTab === "Menu" ? "#ef4444" : "#9ca3af"}
          />
          <Text
            style={[styles.navText, currentTab === "Menu" && styles.navTextActive]}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: "#f9fafb" },
  content: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  brandTitle: { fontSize: 24, fontWeight: "900", color: "#dc2626" },
  brandSubtitle: { fontSize: 10, fontWeight: "700", color: "#9ca3af", letterSpacing: 1 },
  logoutIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { padding: 20 },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 50, height: 50, backgroundColor: "#dc2626", borderRadius: 15, justifyContent: "center", alignItems: "center", marginRight: 15 },
  helloText: { fontSize: 20, fontWeight: "900", color: "#111827", textTransform: "capitalize" },
  subText: { fontSize: 12, color: "#9ca3af", fontWeight: "600" },
  statusBox: { backgroundColor: "#ecfdf5", padding: 15, borderRadius: 15, borderWidth: 1, borderColor: "#d1fae5" },
  statusHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  statusLabel: { fontSize: 10, fontWeight: "900", color: "#059669" },
  statusDescription: { fontSize: 13, color: "#065f46", lineHeight: 18, fontWeight: "600" },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { width: "48%", backgroundColor: "white", padding: 20, borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: "#f3f4f6" },
  iconBg: { width: 45, height: 45, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  actionLabel: { fontSize: 12, fontWeight: "900", color: "#374151" },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 10, fontWeight: "800", color: "#9ca3af", marginTop: 4 },
  navTextActive: { color: "#ef4444" },
  centralCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#dc2626",
    borderRadius: 30,
    marginTop: -40,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default Home;
