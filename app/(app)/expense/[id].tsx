import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppButton from "../../../src/components/AppButton";
import AppText from "../../../src/components/AppText";
import { colors } from "../../../src/theme/colors";
import { useExpenses } from "../../../src/context/ExpensesContext";
import { useAuth } from "../../../src/context/AuthContext";
import type { ExpenseStatus } from "../../../src/types/expense";

function formatAmount(value: number) {
  return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
}

function statusLabel(status: ExpenseStatus) {
  if (status === "claimed_paid") return "Claimed Paid";
  return status[0].toUpperCase() + status.slice(1);
}

export default function ExpenseDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const expenseId = Array.isArray(id) ? id[0] : id;

  const { expenses, markAsPaid, confirmPayments } = useExpenses();
  const { currentUser } = useAuth();

  const expense = useMemo(() => {
    if (!expenseId) return undefined;
    return expenses.find((item) => item.id === expenseId);
  }, [expenseId, expenses]);

  if (!expense) {
    return (
      <View style={styles.emptyState}>
        <AppText weight="bold" style={styles.emptyTitle}>
          Expense not found
        </AppText>
        <AppText style={styles.emptySubtitle}>
          We could not find the requested expense.
        </AppText>
        <AppButton
          title="Back to expenses"
          onPress={() => router.push("/(app)/expenses")}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  const isPayer = expense.paidBy === currentUser;

  const myShare = expense.shares.find((s) => s.user === currentUser);
  const myShareStatus = myShare?.status;

  const claimedCount = expense.shares.filter((s) => s.status === "claimed_paid").length;
  const confirmedCount = expense.shares.filter((s) => s.status === "confirmed").length;
  const totalShares = expense.shares.length;

  const allConfirmed = totalShares > 0 && confirmedCount === totalShares;
  const anyClaimed = claimedCount > 0;

  // Disable rules
  const disableConfirm = !anyClaimed || allConfirmed; // payer cannot confirm if nothing claimed OR already all confirmed
  const disableIPaid =
    !myShare || myShareStatus === "claimed_paid" || myShareStatus === "confirmed" || allConfirmed;

  // UX copy
  const statusLine = allConfirmed
    ? "All confirmed ✅"
    : anyClaimed
      ? "Waiting for payer confirmation"
      : "No one has claimed paid yet";

  const actionTitle = isPayer ? "Confirm payment" : "I paid";
  const actionDisabled = isPayer ? disableConfirm : disableIPaid;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <AppText weight="bold" style={styles.header}>
          {expense.title} — {expense.period}
        </AppText>
        <AppText weight="bold" style={styles.amount}>
          {formatAmount(expense.amount)}
        </AppText>
        <AppText style={styles.paidBy}>Paid by {expense.paidBy}</AppText>

        <View style={styles.statusPill}>
          <AppText weight="semibold" style={styles.statusPillText}>
            {statusLine}
          </AppText>
        </View>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Shares
        </AppText>

        <View style={styles.card}>
          {expense.shares.map((share, index) => (
            <View
              key={share.user}
              style={[styles.shareRow, index > 0 && styles.rowBorder]}
            >
              <AppText weight="semibold" style={styles.shareName}>
                {share.user}
                {share.user === currentUser ? " (You)" : ""}
              </AppText>

              <View style={styles.shareRight}>
                <AppText style={styles.shareAmount}>
                  {formatAmount(share.amount)}
                </AppText>

                <View
                  style={[
                    styles.badge,
                    share.status === "confirmed" && styles.badgeConfirmed,
                    share.status === "pending" && styles.badgePending,
                    share.status === "claimed_paid" && styles.badgeClaimedPaid,
                    share.status === "disputed" && styles.badgeDisputed,
                  ]}
                >
                  <AppText
                    weight="semibold"
                    style={[
                      styles.badgeText,
                      share.status === "confirmed" && styles.badgeTextConfirmed,
                      share.status === "pending" && styles.badgeTextPending,
                      share.status === "claimed_paid" && styles.badgeTextClaimedPaid,
                      share.status === "disputed" && styles.badgeTextDisputed,
                    ]}
                  >
                    {statusLabel(share.status)}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>

        <AppText style={styles.sharesHint}>
          {allConfirmed
            ? "Everyone is confirmed for this expense."
            : isPayer
              ? anyClaimed
                ? `You can confirm ${claimedCount} claimed payment(s).`
                : "No claimed payments to confirm yet."
              : myShareStatus === "pending"
                ? "Mark yourself as paid once you’ve sent the money."
                : myShareStatus === "claimed_paid"
                  ? "You marked as paid — waiting for payer confirmation."
                  : myShareStatus === "confirmed"
                    ? "Your payment is confirmed."
                    : "You are not included in this split."}
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Actions
        </AppText>

        <AppButton
          title={actionTitle}
          disabled={actionDisabled}
          onPress={() => {
            if (!expenseId) return;

            if (isPayer) {
              if (disableConfirm) return;
              confirmPayments(expenseId);
            } else {
              if (disableIPaid) return;
              markAsPaid(expenseId, currentUser);
            }
          }}
          style={[
            styles.actionButton,
            actionDisabled && styles.actionButtonDisabled,
          ]}
        />

        {actionDisabled ? (
          <AppText style={styles.disabledHint}>
            {isPayer
              ? allConfirmed
                ? "All payments are already confirmed."
                : "No roommate has claimed paid yet."
              : myShareStatus === "pending"
                ? ""
                : myShareStatus === "claimed_paid"
                  ? "You already claimed paid. Wait for confirmation."
                  : myShareStatus === "confirmed"
                    ? "Your payment is already confirmed."
                    : "You are not part of this split."}
          </AppText>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32, gap: 18 },

  section: { gap: 10 },

  header: { fontSize: 26, color: colors.text },
  amount: { marginTop: 2, fontSize: 24, color: colors.text },
  paidBy: { fontSize: 15, color: colors.text, opacity: 0.72 },

  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.85,
  },

  sectionTitle: { fontSize: 17, color: colors.text },

  card: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  shareRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },

  shareName: { color: colors.text, fontSize: 15 },
  shareRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  shareAmount: { color: colors.text, fontSize: 14 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12 },

  badgeConfirmed: { backgroundColor: "#EAF7EF", borderColor: "#CBE8D7" },
  badgePending: { backgroundColor: "#FFF7E8", borderColor: colors.warning },
  badgeClaimedPaid: { backgroundColor: "#EAF0FF", borderColor: "#C9D7FF" },
  badgeDisputed: { backgroundColor: "#FEE2E2", borderColor: colors.danger },

  badgeTextConfirmed: { color: "#246A43" },
  badgeTextPending: { color: "#5E3B00" },
  badgeTextClaimedPaid: { color: "#27468A" },
  badgeTextDisputed: { color: "#7F1D1D" },

  sharesHint: {
    color: colors.text,
    opacity: 0.65,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },

  actionButton: { marginTop: 2, alignSelf: "stretch" },
  actionButtonDisabled: { opacity: 0.55 },

  disabledHint: {
    marginTop: 8,
    color: colors.text,
    opacity: 0.6,
    fontSize: 12,
    lineHeight: 16,
  },

  emptyState: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: { color: colors.text, fontSize: 24, textAlign: "center" },
  emptySubtitle: {
    marginTop: 8,
    color: colors.text,
    opacity: 0.7,
    textAlign: "center",
  },
  emptyButton: { marginTop: 20, alignSelf: "stretch" },
});
