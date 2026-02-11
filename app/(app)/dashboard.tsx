import { View, Text } from "react-native";

export default function Dashboard() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Dashboard</Text>
      <Text style={{ marginTop: 8, opacity: 0.7 }}>Balances + pending actions will go here.</Text>
    </View>
  );
}
