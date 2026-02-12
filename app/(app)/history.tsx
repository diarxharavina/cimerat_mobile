import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AppText from "../../src/components/AppText";
import { useActivity } from "../../src/context/ActivityContext";
import { useFlat } from "../../src/context/FlatContext";
import { colors } from "../../src/theme/colors";
import type { ActivityEvent } from "../../src/types/activity";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

export default function HistoryScreen() {
  const { events } = useActivity();
  const { currentFlatId, currentFlat } = useFlat();

  const flatEvents: ActivityEvent[] = useMemo(() => {
    if (!currentFlatId) return [];

    return [...events]
      .filter((event) => event.flatId === currentFlatId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events, currentFlatId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          History
        </AppText>
        <AppText style={styles.subtitle}>
          {currentFlat ? `Recent activity in ${currentFlat.name}` : "Recent flat activity"}
        </AppText>
      </View>

      {!currentFlatId ? (
        <View style={styles.emptyState}>
          <AppText weight="semibold" style={styles.emptyTitle}>
            No flat selected
          </AppText>
          <AppText style={styles.emptySubtitle}>
            Join or create a flat to view activity history.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={flatEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AppText weight="semibold" style={styles.emptyTitle}>
                No activity yet
              </AppText>
              <AppText style={styles.emptySubtitle}>
                Activity events will appear here as expenses are updated.
              </AppText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <AppText style={styles.message}>{item.message}</AppText>
              <AppText style={styles.timestamp}>{formatTimestamp(item.createdAt)}</AppText>
            </View>
          )}
        />
      )}
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
    gap: 10,
    paddingBottom: 14,
  },
  row: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
    gap: 6,
  },
  message: {
    color: colors.text,
    fontSize: 14,
  },
  timestamp: {
    color: colors.text,
    opacity: 0.62,
    fontSize: 12,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
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
});
