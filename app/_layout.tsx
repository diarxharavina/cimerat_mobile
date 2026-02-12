import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import {
  useFonts,
  FiraSans_400Regular,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
} from "@expo-google-fonts/fira-sans";
import { ActivityProvider } from "../src/context/ActivityContext";
import { AuthProvider } from "../src/context/AuthContext";
import { FlatProvider } from "../src/context/FlatContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    FiraSans_400Regular,
    FiraSans_600SemiBold,
    FiraSans_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthProvider>
      <FlatProvider>
        <ActivityProvider>
          <ExpensesProvider>
            <Stack screenOptions={{ headerTitleAlign: "center" }} />
          </ExpensesProvider>
        </ActivityProvider>
      </FlatProvider>
    </AuthProvider>
  );
}
