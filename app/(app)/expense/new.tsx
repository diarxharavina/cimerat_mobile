import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppButton from "../../../src/components/AppButton";
import AppText from "../../../src/components/AppText";
import { useAuth, type AuthUser } from "../../../src/context/AuthContext";
import { useFlat } from "../../../src/context/FlatContext";
import { useExpenses } from "../../../src/context/ExpensesContext";
import { colors } from "../../../src/theme/colors";
import type { Expense } from "../../../src/types/expense";

const roommates: AuthUser[] = ["Arber", "Mark", "Driton"];

export default function NewExpense() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { currentFlatId } = useFlat();
  const { addExpense } = useExpenses();

  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleCreateExpense() {
    const trimmedTitle = title.trim();
    const trimmedPeriod = period.trim();
    const parsedAmount = Number(amount);

    if (!trimmedTitle || !trimmedPeriod || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter title, period, and an amount greater than 0.");
      return;
    }

    if (!currentFlatId) {
      setError("Join or create a flat before creating expenses.");
      return;
    }

    const shareAmount = Number((parsedAmount / roommates.length).toFixed(2));

    const expense: Expense = {
      id: `${trimmedTitle.toLowerCase().replaceAll(" ", "-")}-${trimmedPeriod.toLowerCase()}-${Date.now()}`,
      flatId: currentFlatId,
      title: trimmedTitle,
      period: trimmedPeriod,
      amount: Number(parsedAmount.toFixed(2)),
      paidBy: currentUser,
      createdAt: new Date().toISOString(),
      shares: roommates.map((user) => ({
        user,
        amount: shareAmount,
        status: user === currentUser ? "confirmed" : "pending",
      })),
    };

    addExpense(expense);
    router.replace("/(app)/expenses");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          New Expense
        </AppText>
        <AppText style={styles.subtitle}>Create a shared expense for your apartment.</AppText>
      </View>

      <View style={styles.formCard}>
        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Title
          </AppText>
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError("");
            }}
            placeholder="Rent"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Period
          </AppText>
          <TextInput
            value={period}
            onChangeText={(text) => {
              setPeriod(text);
              if (error) setError("");
            }}
            placeholder="March"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Amount
          </AppText>
          <TextInput
            value={amount}
            onChangeText={(text) => {
              setAmount(text.replace(",", "."));
              if (error) setError("");
            }}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
        {!currentFlatId ? (
          <AppText style={styles.infoText}>
            You are not currently in a flat. Join or create one from the Flat screen.
          </AppText>
        ) : null}

        <AppButton
          title="Create expense"
          onPress={handleCreateExpense}
          style={styles.createButton}
        />
      </View>
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
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text,
    opacity: 0.7,
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    backgroundColor: colors.background,
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
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
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  infoText: {
    color: colors.text,
    opacity: 0.75,
    fontSize: 13,
  },
  createButton: {
    marginTop: 4,
    alignSelf: "stretch",
  },
});
