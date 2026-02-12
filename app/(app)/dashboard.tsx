import { StyleSheet, View } from "react-native";
import AppText from "../../src/components/AppText";
import { colors } from "../../src/theme/colors";
import { useExpenses } from "../../src/context/ExpensesContext";
import { useAuth } from "../../src/context/AuthContext";
import { useFlat } from "../../src/context/FlatContext";
import { calculateBalancesForUser } from "../../src/utils/balances";

function money(n: number) {
  return Number.isInteger(n) ? `€${n}` : `€${n.toFixed(2)}`;
}

export default function Dashboard() {
  const { expenses } = useExpenses();
  const { currentUser } = useAuth();
  const { currentFlatId, currentFlat } = useFlat();

  const { youOwe, youAreOwed, net } = calculateBalancesForUser(
    expenses,
    currentFlatId,
    currentUser
  );

  const settled = youOwe === 0 && youAreOwed === 0;

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Dashboard
      </AppText>

      <AppText style={styles.subtitle}>
        {currentFlat ? `Flat: ${currentFlat.name}` : "No flat selected"}
      </AppText>

      <View style={styles.card}>
        <AppText weight="semibold" style={styles.cardTitle}>
          Your balance
        </AppText>

        {settled ? (
          <AppText weight="bold" style={styles.settled}>
            All settled ✅
          </AppText>
        ) : (
          <View style={{ gap: 8 }}>
            <View style={styles.row}>
              <AppText style={styles.label}>You owe</AppText>
              <AppText weight="bold" style={styles.value}>
                {money(youOwe)}
              </AppText>
            </View>

            <View style={styles.row}>
              <AppText style={styles.label}>You are owed</AppText>
              <AppText weight="bold" style={styles.value}>
                {money(youAreOwed)}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <AppText style={styles.label}>Net</AppText>
              <AppText weight="bold" style={styles.value}>
                {net >= 0 ? `+${money(net)}` : `-${money(Math.abs(net))}`}
              </AppText>
            </View>
          </View>
        )}
      </View>

      <View style={styles.hintCard}>
        <AppText style={styles.hint}>
          Tip: “Claimed Paid” still counts as unpaid until the payer confirms.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    color: colors.text,
    opacity: 0.65,
  },
  card: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: colors.background,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.9,
  },
  settled: {
    fontSize: 18,
    color: colors.text,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.text,
    opacity: 0.7,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  hintCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.background,
  },
  hint: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 13,
    lineHeight: 18,
  },
});
