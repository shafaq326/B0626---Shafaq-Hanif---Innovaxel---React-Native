import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../utils/categories";

export default function SummaryScreen() {
  const { expenses } = useExpenses();
  const router = useRouter();

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = CATEGORIES.map((cat) => {
    const catTotal = expenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { ...cat, total: catTotal };
  })
    .filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxAmount = Math.max(...categoryTotals.map((c) => c.total), 1);

  const mostSpent = categoryTotals[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>Rs {total.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Transactions</Text>
          <Text style={styles.statValue}>{expenses.length}</Text>
        </View>
        {mostSpent && (
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Top Category</Text>
            <Text style={styles.statValue}>{mostSpent.label}</Text>
          </View>
        )}
      </View>

      {/* Category breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {categoryTotals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No expenses to summarize</Text>
          </View>
        ) : (
          categoryTotals.map((cat) => (
            <View key={cat.value} style={styles.catRow}>
              <View style={styles.catHeader}>
                <View style={styles.catNameRow}>
                  <View style={[styles.dot, { backgroundColor: cat.color }]} />
                  <Text style={styles.catName}>{cat.label}</Text>
                </View>
                <View style={styles.catAmountRow}>
                  <Text style={styles.catAmount}>
                    Rs {cat.total.toLocaleString()}
                  </Text>
                  <Text style={styles.catPercent}>
                    {total > 0 ? Math.round((cat.total / total) * 100) : 0}%
                  </Text>
                </View>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(cat.total / maxAmount) * 100}%`,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    paddingTop: 55,
    backgroundColor: "#2C2C54",
  },
  backBtn: { color: "#aaa", fontSize: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 6,
  },

  section: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },

  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: "#aaa", fontSize: 15 },

  catRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  catNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 14, fontWeight: "600", color: "#333" },
  catAmountRow: { alignItems: "flex-end" },
  catAmount: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  catPercent: { fontSize: 11, color: "#999", marginTop: 2 },
  barTrack: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: 4 },
});
