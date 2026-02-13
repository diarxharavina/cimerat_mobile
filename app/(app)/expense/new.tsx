import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppButton from "../../../src/components/AppButton";
import AppText from "../../../src/components/AppText";
import { useAuth } from "../../../src/context/AuthContext";
import { useFlat } from "../../../src/context/FlatContext";
import { useExpenses } from "../../../src/context/ExpensesContext";
import { colors } from "../../../src/theme/colors";
import type { Expense } from "../../../src/types/expense";

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseMoney(input: string) {
  // keep digits + one dot
  const cleaned = input.replace(",", ".").replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

export default function NewExpense() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { currentFlatId, currentFlat } = useFlat();
  const { addExpense } = useExpenses();

  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [excludedUsers, setExcludedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field-level errors
  const [titleError, setTitleError] = useState<string>("");
  const [periodError, setPeriodError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [splitError, setSplitError] = useState<string>("");
  const [globalError, setGlobalError] = useState<string>("");

  const members = currentFlat?.members ?? [];
  const includedUsers = members.filter((member) => !excludedUsers.includes(member));

  function clearErrors() {
    setTitleError("");
    setPeriodError("");
    setAmountError("");
    setSplitError("");
    setGlobalError("");
  }

  function toggleExcludedUser(user: string) {
    // Payer cannot be excluded
    if (user === currentUser) {
      setSplitError("Payer cannot be excluded from the split.");
      return;
    }

    if (splitError) setSplitError("");
    if (globalError) setGlobalError("");

    setExcludedUsers((prev) =>
      prev.includes(user) ? prev.filter((m) => m !== user) : [...prev, user]
    );
  }

  const parsedAmount = useMemo(() => Number(amount), [amount]);
  const trimmedTitle = title.trim();
  const trimmedPeriod = period.trim();

  const isFlatReady = Boolean(currentFlatId);
  const hasMembers = members.length > 0;
  const hasIncluded = includedUsers.length > 0;
  const payerIncluded = includedUsers.includes(currentUser);

  const amountIsValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const canSubmit =
    !isSubmitting &&
    isFlatReady &&
    hasMembers &&
    trimmedTitle.length > 0 &&
    trimmedPeriod.length > 0 &&
    amountIsValid &&
    hasIncluded &&
    payerIncluded;

  function validateAndSetErrors() {
    let ok = true;

    setTitleError("");
    setPeriodError("");
    setAmountError("");
    setSplitError("");
    setGlobalError("");

    if (!trimmedTitle) {
      setTitleError("Title is required.");
      ok = false;
    }

    if (!trimmedPeriod) {
      setPeriodError("Period is required.");
      ok = false;
    }

    if (!amountIsValid) {
      setAmountError("Enter an amount greater than 0.");
      ok = false;
    }

    if (!currentFlatId) {
      setGlobalError("Join or create a flat before creating expenses.");
      ok = false;
    }

    if (members.length === 0) {
      setGlobalError("This flat has no members yet.");
      ok = false;
    }

    if (includedUsers.length === 0) {
      setSplitError("At least one roommate must be included in the split.");
      ok = false;
    }

    if (!includedUsers.includes(currentUser)) {
      setSplitError("Payer must be included in the split.");
      ok = false;
    }

    return ok;
  }

  function handleCreateExpense() {
    if (isSubmitting) return;

    clearErrors();
    const ok = validateAndSetErrors();
    if (!ok) return;

    setIsSubmitting(true);

    try {
      const totalAmount = round2(parsedAmount);
      const includedCount = includedUsers.length;

      // base share: floor to 2 decimals
      const baseShare = Math.floor((totalAmount / includedCount) * 100) / 100;
      const totalBase = baseShare * includedCount;
      const remainder = round2(totalAmount - totalBase);

      const expense: Expense = {
        id: `${trimmedTitle
          .toLowerCase()
          .replaceAll(" ", "-")}-${trimmedPeriod.toLowerCase()}-${Date.now()}`,
        flatId: currentFlatId!,
        title: trimmedTitle,
        period: trimmedPeriod,
        amount: totalAmount,
        paidBy: currentUser,
        createdAt: new Date().toISOString(),
        shares: includedUsers.map((user) => {
          const isPayer = user === currentUser;
          return {
            user,
            // remainder goes to payer
            amount: isPayer ? round2(baseShare + remainder) : baseShare,
            status: isPayer ? "confirmed" : "pending",
          };
        }),
      };

      addExpense(expense);
      router.replace("/(app)/expenses");
    } catch {
      setGlobalError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
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
              if (titleError) setTitleError("");
              if (globalError) setGlobalError("");
            }}
            placeholder="Rent"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, titleError ? styles.inputError : null]}
          />
          {titleError ? <AppText style={styles.errorText}>{titleError}</AppText> : null}
        </View>

        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Period
          </AppText>
          <TextInput
            value={period}
            onChangeText={(text) => {
              setPeriod(text);
              if (periodError) setPeriodError("");
              if (globalError) setGlobalError("");
            }}
            placeholder="March"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, periodError ? styles.inputError : null]}
          />
          {periodError ? <AppText style={styles.errorText}>{periodError}</AppText> : null}
        </View>

        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Amount
          </AppText>
          <TextInput
            value={amount}
            onChangeText={(text) => {
              setAmount(parseMoney(text));
              if (amountError) setAmountError("");
              if (globalError) setGlobalError("");
            }}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            style={[styles.input, amountError ? styles.inputError : null]}
          />
          {amountError ? <AppText style={styles.errorText}>{amountError}</AppText> : null}
        </View>

        <View style={styles.field}>
          <AppText weight="semibold" style={styles.label}>
            Who pays?
          </AppText>
          <AppText style={styles.helperText}>
            Included: {includedUsers.length}/{members.length}. Tap to exclude/include.
          </AppText>

          {!currentFlatId ? (
            <AppText style={styles.infoText}>
              You are not currently in a flat. Join or create one from the Flat screen.
            </AppText>
          ) : members.length === 0 ? (
            <AppText style={styles.infoText}>No members found in this flat.</AppText>
          ) : (
            <View style={styles.memberList}>
              {members.map((member) => {
                const isPayer = member === currentUser;
                const isExcluded = excludedUsers.includes(member);

                return (
                  <View
                    key={member}
                    style={[styles.memberRow, isExcluded ? styles.memberRowExcluded : null]}
                  >
                    <View style={styles.memberMain}>
                      <AppText
                        weight="semibold"
                        style={[styles.memberName, isExcluded ? styles.memberNameExcluded : null]}
                      >
                        {member}
                      </AppText>
                      <View style={styles.memberMeta}>
                        {isPayer ? <AppText style={styles.memberPayerTag}>Payer</AppText> : null}
                        {isExcluded ? (
                          <AppText style={styles.memberExcludedTag}>Excluded</AppText>
                        ) : null}
                      </View>
                    </View>

                    <Pressable
                      onPress={() => toggleExcludedUser(member)}
                      style={[
                        styles.toggleButton,
                        isPayer
                          ? styles.toggleButtonPayer
                          : isExcluded
                            ? styles.toggleButtonInclude
                            : styles.toggleButtonExclude,
                      ]}
                    >
                      <AppText
                        weight="semibold"
                        style={[
                          styles.toggleText,
                          isPayer
                            ? styles.toggleTextPayer
                            : isExcluded
                              ? styles.toggleTextInclude
                              : styles.toggleTextExclude,
                        ]}
                      >
                        {isPayer ? "Payer" : isExcluded ? "Include" : "Exclude"}
                      </AppText>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          {splitError ? <AppText style={styles.errorText}>{splitError}</AppText> : null}
        </View>

        {globalError ? <AppText style={styles.errorText}>{globalError}</AppText> : null}

        <AppButton
          title={isSubmitting ? "Creating..." : "Create expense"}
          onPress={handleCreateExpense}
          disabled={!canSubmit}
          style={styles.createButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },

  header: { gap: 6 },
  title: { fontSize: 28, color: colors.text },
  subtitle: { fontSize: 15, color: colors.text, opacity: 0.7 },

  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    backgroundColor: colors.background,
  },

  field: { gap: 8 },
  label: { color: colors.text, fontSize: 14 },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },

  helperText: { color: colors.text, opacity: 0.7, fontSize: 13 },

  memberList: { gap: 8 },
  memberRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  memberRowExcluded: { opacity: 0.6 },

  memberMain: { flex: 1, gap: 4 },
  memberName: { color: colors.text, fontSize: 15 },
  memberNameExcluded: { textDecorationLine: "line-through" },

  memberMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  memberPayerTag: { color: colors.primary, fontSize: 12 },
  memberExcludedTag: { color: colors.danger, fontSize: 12 },

  toggleButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  toggleButtonExclude: { borderColor: colors.danger, backgroundColor: colors.background },
  toggleButtonInclude: { borderColor: colors.primary, backgroundColor: colors.background },
  toggleButtonPayer: { borderColor: colors.primary, backgroundColor: "rgba(54, 41, 183, 0.08)" },

  toggleText: { fontSize: 12 },
  toggleTextExclude: { color: colors.danger },
  toggleTextInclude: { color: colors.primary },
  toggleTextPayer: { color: colors.primary },

  errorText: { color: colors.danger, fontSize: 13 },
  infoText: { color: colors.text, opacity: 0.75, fontSize: 13 },

  createButton: { marginTop: 4, alignSelf: "stretch" },
});
