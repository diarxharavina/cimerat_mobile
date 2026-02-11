import { View, Text } from "react-native";

export default function Auth() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Login</Text>
      <Text style={{ marginTop: 8, opacity: 0.7 }}>Apple / Google / Email next.</Text>
    </View>
  );
}
