import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppButton from "../../../src/components/AppButton";
import AppText from "../../../src/components/AppText";
import { useActivity } from "../../../src/context/ActivityContext";
import { colors } from "../../../src/theme/colors";
import { useAuth } from "../../../src/context/AuthContext";
import { useExpenses } from "../../../src/context/ExpensesContext";
import type { ExpenseStatus } from "../../../src/types/expense";

function formatAmount(value: number) {
  return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

function statusLabel(status: ExpenseStatus) {
  if (status === "claimed_paid") return "Claimed Paid";
  return status[0].toUpperCase() + status.slice(1);
}

export default function ExpenseDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const expenseId = Array.isArray(id) ? id[0] : id;

  const { currentUser } = useAuth();
  const { events } = useActivity();
  const { expenses, markAsPaid, confirmPayments } = useExpenses();

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
  const expenseKey = `${expense.title} (${expense.period})`;
  const historyEvents = useMemo(
    () =>
      [...events]
        .filter(
          (event) =>
            event.flatId === expense.flatId && event.message.includes(expenseKey)
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [events, expense.flatId, expenseKey]
  );

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
                      share.status === "claimed_paid" &&
                        styles.badgeTextClaimedPaid,
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
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          Actions
        </AppText>

        <AppButton
          title={isPayer ? "Confirm payment" : "I paid"}
          onPress={() => {
            if (!expenseId) return;

            if (!isPayer) {
              markAsPaid(expenseId, currentUser);
            } else {
              confirmPayments(expenseId);
            }
          }}
          style={styles.actionButton}
        />
      </View>

      <View style={styles.section}>
        <AppText weight="semibold" style={styles.sectionTitle}>
          History
        </AppText>

        <View style={styles.card}>
          {historyEvents.length === 0 ? (
            <View style={styles.historyRow}>
              <AppText style={styles.historyTitle}>
                No activity for this expense yet.
              </AppText>
            </View>
          ) : (
            historyEvents.map((event, index) => (
              <View
                key={event.id}
                style={[styles.historyRow, index > 0 && styles.rowBorder]}
              >
                <AppText style={styles.historyTitle}>{event.message}</AppText>
                <AppText style={styles.historyTimestamp}>
                  {formatTimestamp(event.createdAt)}
                </AppText>
              </View>
            ))
          )}
        </View>
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
    paddingBottom: 32,
    gap: 18,
  },
  section: {
    gap: 10,
  },
  header: {
    fontSize: 26,
    color: colors.text,
  },
  amount: {
    marginTop: 2,
    fontSize: 24,
    color: colors.text,
  },
  paidBy: {
    fontSize: 15,
    color: colors.text,
    opacity: 0.72,
  },
  sectionTitle: {
    fontSize: 17,
    color: colors.text,
  },
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
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shareName: {
    color: colors.text,
    fontSize: 15,
  },
  shareRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shareAmount: {
    color: colors.text,
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
  },
  badgeConfirmed: {
    backgroundColor: "#EAF7EF",
    borderColor: "#CBE8D7",
  },
  badgePending: {
    backgroundColor: "#FFF7E8",
    borderColor: colors.warning,
  },
  badgeClaimedPaid: {
    backgroundColor: "#EAF0FF",
    borderColor: "#C9D7FF",
  },
  badgeDisputed: {
    backgroundColor: "#FEE2E2",
    borderColor: colors.danger,
  },
  badgeTextConfirmed: {
    color: "#246A43",
  },
  badgeTextPending: {
    color: "#5E3B00",
  },
  badgeTextClaimedPaid: {
    color: "#27468A",
  },
  badgeTextDisputed: {
    color: "#7F1D1D",
  },
  actionButton: {
    marginTop: 2,
    alignSelf: "stretch",
  },
  historyRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  historyTitle: {
    color: colors.text,
    fontSize: 14,
  },
  historyTimestamp: {
    color: colors.text,
    opacity: 0.6,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 8,
    color: colors.text,
    opacity: 0.7,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 20,
    alignSelf: "stretch",
  },
});
