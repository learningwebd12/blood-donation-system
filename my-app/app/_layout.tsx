import { AuthProvider } from "../context/AuthContext";
import AuthGate from "../components/AuthGate";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Toast />
    </AuthProvider>
  );
}
