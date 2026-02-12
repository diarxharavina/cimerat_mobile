import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import AppButton from "../../src/components/AppButton";
import AppText from "../../src/components/AppText";
import { useFlat } from "../../src/context/FlatContext";
import { colors } from "../../src/theme/colors";
import type { Expense, ExpenseStatus } from "../../src/types/expense";
import { useExpenses } from "../../src/context/ExpensesContext";
import { useAuth } from "../../src/context/AuthContext";
import { calculateBalancesForUser } from "../../src/utils/balances";


function isSettled(statuses: ExpenseStatus[]) {
  return statuses.length > 0 && statuses.every((s) => s === "confirmed");
}

function formatAmount(value: number) {
  return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
}

export default function Expenses() {
  const router = useRouter();
  const { expenses } = useExpenses();
  const { currentUser } = useAuth();
const { currentFlatId } = useFlat();

const { youOwe, youAreOwed, net } = calculateBalancesForUser(
  expenses,
  currentFlatId,
  currentUser
);

  const filteredExpenses: Expense[] = currentFlatId
    ? expenses.filter((expense) => expense.flatId === currentFlatId)
    : [];

  const sortedExpenses: Expense[] = [...filteredExpenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          Expenses
        </AppText>
        <AppText style={styles.subtitle}>Track rent and utilities</AppText>
      </View>

      <View style={styles.balanceCard}>
        <AppText weight="semibold" style={styles.balanceTitle}>
          Your balance
        </AppText>

        {youOwe === 0 && youAreOwed === 0 ? (
          <AppText style={styles.balanceSettled}>All settled ✅</AppText>
        ) : (
          <AppText style={styles.balanceText}>
            {net >= 0
              ? `You are owed €${net}`
              : `You owe €${Math.abs(net)}`}
          </AppText>
        )}
      </View>

      <FlatList
        data={sortedExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText weight="semibold" style={styles.emptyTitle}>
              {currentFlatId ? "No expenses yet" : "No flat selected"}
            </AppText>
            <AppText style={styles.emptySubtitle}>
              {currentFlatId
                ? "Create your first shared expense."
                : "Create or join a flat first, then add expenses."}
            </AppText>
          </View>
        }
        renderItem={({ item }) => {
          const settled = isSettled(item.shares.map((s) => s.status));
          const badgeLabel = settled ? "Settled" : "Pending";

          return (
            <Pressable
              onPress={() => router.push({ pathname: "/(app)/expense/[id]", params: { id: item.id } })}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowTop}>
                <View>
                  <AppText weight="semibold" style={styles.expenseTitle}>
                    {item.title}
                  </AppText>
                  <AppText style={styles.period}>{item.period}</AppText>
                </View>

                <AppText weight="bold" style={styles.amount}>
                  {formatAmount(item.amount)}
                </AppText>
              </View>

              <View style={styles.rowBottom}>
                <AppText style={styles.paidBy}>Paid by {item.paidBy}</AppText>

                <View
                  style={[
                    styles.statusBadge,
                    settled ? styles.settledBadge : styles.pendingBadge,
                  ]}
                >
                  <AppText
                    weight="semibold"
                    style={[
                      styles.statusText,
                      settled ? styles.settledText : styles.pendingText,
                    ]}
                  >
                    {badgeLabel}
                  </AppText>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <AppButton
        title="Add expense"
        onPress={() => router.push("/(app)/expense/new")}
        style={styles.addButton}
      />
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
  },
  header: {
    marginBottom: 14,
  },
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
  listContent: {
    paddingBottom: 16,
    gap: 12,
    flexGrow: 1,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 2,
    gap: 6,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
  },
  emptySubtitle: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
  },
  row: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseTitle: {
    fontSize: 17,
    color: colors.text,
  },
  period: {
    marginTop: 3,
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  amount: {
    fontSize: 17,
    color: colors.text,
  },
  rowBottom: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paidBy: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.78,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
  },
  settledBadge: {
    backgroundColor: "#EAF7EF",
    borderColor: "#CBE8D7",
  },
  settledText: {
    color: "#246A43",
  },
  pendingBadge: {
    backgroundColor: "#FFF7E8",
    borderColor: colors.warning,
  },
  pendingText: {
    color: "#5E3B00",
  },
  addButton: {
    marginTop: "auto",
    alignSelf: "stretch",
  },
  balanceCard: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    backgroundColor: colors.background,
  },
  balanceTitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  balanceText: {
    marginTop: 4,
    fontSize: 15,
    color: colors.text,
  },
  balanceSettled: {
    marginTop: 4,
    fontSize: 15,
    color: colors.text,
  },
  
});
