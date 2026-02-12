import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import AppButton from "../../src/components/AppButton";
import AppText from "../../src/components/AppText";
import { useAuth, type AuthUser } from "../../src/context/AuthContext";
import { colors } from "../../src/theme/colors";

const mockUsers: AuthUser[] = ["Arber", "Mark", "Driton"];

export default function More() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        More
      </AppText>
      <AppText style={styles.subtitle}>
        Responsibilities, Notifications, History.
      </AppText>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Dev user switcher
        </AppText>
        <AppText style={styles.selectedUser}>
          Current user: {currentUser}
        </AppText>
        <View style={styles.userButtons}>
          {mockUsers.map((user) => (
            <AppButton
              key={user}
              title={user}
              variant={currentUser === user ? "primary" : "ghost"}
              onPress={() => setCurrentUser(user)}
              style={styles.userButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Navigation
        </AppText>
        <View style={styles.navButtons}>
          <AppButton
            title="Flat"
            variant="ghost"
            onPress={() => router.push("/(app)/flat")}
            style={styles.navButton}
          />
          <AppButton
            title="Responsibilities"
            variant="ghost"
            onPress={() => router.push("/(app)/responsibilities")}
            style={styles.navButton}
          />
          <AppButton
            title="Notifications"
            variant="ghost"
            onPress={() => router.push("/(app)/notifications")}
            style={styles.navButton}
          />
          <AppButton
            title="History"
            variant="ghost"
            onPress={() => router.push("/(app)/history")}
            style={styles.navButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    color: colors.text,
    opacity: 0.7,
  },
  section: {
    marginTop: 22,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.text,
  },
  selectedUser: {
    color: colors.text,
    opacity: 0.8,
  },
  userButtons: {
    gap: 8,
  },
  userButton: {
    alignSelf: "stretch",
  },
  navButtons: {
    gap: 10,
  },
  navButton: {
    alignSelf: "stretch",
  },
});
