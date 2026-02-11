import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Login</Text>

      <Pressable
        onPress={() => router.replace("/(app)/dashboard")}
        style={{
          marginTop: 20,
          backgroundColor: "#1E4E8C",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          Continue (Mock Login)
        </Text>
      </Pressable>
    </View>
  );
}
