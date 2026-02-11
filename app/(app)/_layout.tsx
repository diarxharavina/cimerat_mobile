import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="expenses" options={{ title: "Expenses" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />

      {/* Hide these from the tab bar (they are opened from "More") */}
      <Tabs.Screen name="responsibilities" options={{ href: null, title: "Responsibilities" }} />
      <Tabs.Screen name="notifications" options={{ href: null, title: "Notifications" }} />
      <Tabs.Screen name="history" options={{ href: null, title: "History" }} />
    </Tabs>
  );
}
