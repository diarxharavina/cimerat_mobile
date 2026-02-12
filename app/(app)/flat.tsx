import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppButton from "../../src/components/AppButton";
import AppText from "../../src/components/AppText";
import { useFlat } from "../../src/context/FlatContext";
import { colors } from "../../src/theme/colors";

export default function FlatScreen() {
  const { flats, currentFlatId, createFlat, joinFlat, leaveFlat } = useFlat();
  const currentFlat = flats.find((flat) => flat.id === currentFlatId) ?? null;

  const [newFlatName, setNewFlatName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");

  function handleCreateFlat() {
    const name = newFlatName.trim();
    if (!name) {
      setMessage("Enter a flat name first.");
      return;
    }

    createFlat(name);
    setNewFlatName("");
    setMessage(`Flat "${name}" created.`);
  }

  function handleJoinFlat() {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setMessage("Enter a flat code.");
      return;
    }

    const exists = flats.some((flat) => flat.code.toUpperCase() === code);
    if (!exists) {
      setMessage("Flat code not found.");
      return;
    }

    joinFlat(code);
    setJoinCode("");
    setMessage(`Joined flat with code ${code}.`);
  }

  function handleLeaveFlat() {
    if (!currentFlatId) {
      setMessage("You are not currently in a flat.");
      return;
    }

    leaveFlat();
    setMessage("You left the current flat.");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <AppText weight="bold" style={styles.title}>
          Flat
        </AppText>
        <AppText style={styles.subtitle}>Manage your current flat and membership.</AppText>
      </View>

      <View style={styles.card}>
        <AppText weight="semibold" style={styles.cardTitle}>
          Current Flat
        </AppText>
        {currentFlat ? (
          <View style={styles.currentFlatBody}>
            <AppText style={styles.flatName}>{currentFlat.name}</AppText>
            <AppText style={styles.flatMeta}>Code: {currentFlat.code}</AppText>
            <AppText style={styles.flatMeta}>Members: {currentFlat.members.join(", ")}</AppText>
          </View>
        ) : (
          <AppText style={styles.flatMeta}>No flat selected.</AppText>
        )}
      </View>

      <View style={styles.card}>
        <AppText weight="semibold" style={styles.cardTitle}>
          Create Flat
        </AppText>
        <TextInput
          value={newFlatName}
          onChangeText={(text) => {
            setNewFlatName(text);
            if (message) setMessage("");
          }}
          placeholder="Flat name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <AppButton title="Create Flat" onPress={handleCreateFlat} style={styles.fullButton} />
      </View>

      <View style={styles.card}>
        <AppText weight="semibold" style={styles.cardTitle}>
          Join Flat
        </AppText>
        <TextInput
          value={joinCode}
          onChangeText={(text) => {
            setJoinCode(text.toUpperCase());
            if (message) setMessage("");
          }}
          autoCapitalize="characters"
          placeholder="CIM-123"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <AppButton title="Join Flat" onPress={handleJoinFlat} style={styles.fullButton} />
      </View>

      <View style={styles.card}>
        <AppText weight="semibold" style={styles.cardTitle}>
          Leave Flat
        </AppText>
        <AppButton title="Leave Flat" variant="ghost" onPress={handleLeaveFlat} style={styles.fullButton} />
      </View>

      {message ? <AppText style={styles.message}>{message}</AppText> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  section: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    color: colors.text,
  },
  subtitle: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    backgroundColor: colors.background,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
  },
  currentFlatBody: {
    gap: 4,
  },
  flatName: {
    color: colors.text,
    fontSize: 18,
  },
  flatMeta: {
    color: colors.text,
    opacity: 0.75,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  fullButton: {
    alignSelf: "stretch",
  },
  message: {
    color: colors.text,
    opacity: 0.85,
    fontSize: 13,
  },
});
