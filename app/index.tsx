import { View } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../src/components/AppButton";
import AppText from "../src/components/AppText";
import { colors } from "../src/theme/colors";

export default function Home() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <AppText weight="bold" style={{ fontSize: 30, color: colors.text }}>
        Cimerat
      </AppText>

      <AppText style={{ marginTop: 10, opacity: 0.7, textAlign: "center" }}>
        Roommates, without arguments.
      </AppText>

      <AppButton
        title="Get started"
        onPress={() => router.push("/(auth)/login")}
        style={{ marginTop: 18, alignSelf: "stretch" }}
      />
    </View>
  );
}
