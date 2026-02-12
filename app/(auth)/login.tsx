import { View } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../../src/components/AppButton";
import AppText from "../../src/components/AppText";
import { colors } from "../../src/theme/colors";

export default function Login() {
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
      <AppText weight="bold" style={{ fontSize: 24, color: colors.text }}>
        Login
      </AppText>

      <AppText style={{ marginTop: 10, opacity: 0.7, textAlign: "center" }}>
        Apple / Google / Email will be added soon.
      </AppText>

      <AppButton
        title="Continue (Mock Login)"
        onPress={() => router.replace("/(app)/dashboard")}
        style={{ marginTop: 18, alignSelf: "stretch" }}
      />
    </View>
  );
}
