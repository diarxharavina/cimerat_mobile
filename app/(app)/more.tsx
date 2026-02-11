import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function More() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>More</Text>
      <Text style={{ marginTop: 8, opacity: 0.7 }}>
        Responsibilities, Notifications, History.
      </Text>

      <View style={{ marginTop: 18, gap: 10 }}>
        <Pressable
          onPress={() => router.push("/(app)/responsibilities")}
          style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" }}
        >
          <Text style={{ fontWeight: "700" }}>Responsibilities</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/notifications")}
          style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" }}
        >
          <Text style={{ fontWeight: "700" }}>Notifications</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/history")}
          style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB" }}
        >
          <Text style={{ fontWeight: "700" }}>History</Text>
        </Pressable>
      </View>
    </View>
  );
}
