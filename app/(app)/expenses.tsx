import { View, Text, Pressable } from "react-native";

export default function Expenses() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Expenses</Text>
      <Text style={{ marginTop: 8, opacity: 0.7 }}>
        Rent + utilities will show here.
      </Text>

      <Pressable
        style={{
          marginTop: 16,
          backgroundColor: "#1E4E8C",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Add expense</Text>
      </Pressable>
    </View>
  );
}
