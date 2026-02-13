import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import AppButton from "../../src/components/AppButton";
import AppText from "../../src/components/AppText";
import { useAuth } from "../../src/context/AuthContext";
import { colors } from "../../src/theme/colors";

export default function More() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          More
        </AppText>
        <AppText style={styles.subtitle}>Settings and tools</AppText>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Switch user (dev)
        </AppText>

        <View style={styles.buttonStack}>
          <AppButton
            title="Driton"
            onPress={() => setCurrentUser("Driton")}
            variant={currentUser === "Driton" ? "primary" : "neutral"}
          />
          <AppButton
            title="Arber"
            onPress={() => setCurrentUser("Arber")}
            variant={currentUser === "Arber" ? "primary" : "neutral"}
          />
          <AppButton
            title="Mark"
            onPress={() => setCurrentUser("Mark")}
            variant={currentUser === "Mark" ? "primary" : "neutral"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Flat
        </AppText>
        <View style={styles.buttonStack}>
          <AppButton
            title="Manage flat"
            onPress={() => router.push("/(app)/flat")}
            variant="neutral"
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Other
        </AppText>

        <View style={styles.buttonStack}>
          <AppButton
            title="Responsibilities"
            onPress={() => router.push("/(app)/responsibilities")}
            variant="neutral"
          />
          <AppButton
            title="Notifications"
            onPress={() => router.push("/(app)/notifications")}
            variant="neutral"
          />
          <AppButton
            title="History"
            onPress={() => router.push("/(app)/history")}
            variant="neutral"
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 18,
  },
  header: {},
  title: {
    fontSize: 28,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.text,
    opacity: 0.65,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.text,
  },
  buttonStack: {
    gap: 10,
  },
});
