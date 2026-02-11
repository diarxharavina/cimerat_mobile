import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Cimerat</Text>
      <Text style={{ marginTop: 8, opacity: 0.7, textAlign: "center" }}>
        Roommates, without arguments.
      </Text>

      <Pressable
        onPress={() => router.push("/auth")}
        style={{ marginTop: 16, backgroundColor: "#1E4E8C", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>Get started</Text>
      </Pressable>
    </View>
  );
}
