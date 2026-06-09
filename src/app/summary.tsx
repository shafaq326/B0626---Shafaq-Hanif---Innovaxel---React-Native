import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../utils/categories";

export default function SummaryScreen() {
  const { expenses } = useExpenses();
  const { colors } = useTheme();
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Total Spent
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {"Rs " + total.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>
            Transactions
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {expenses.length.toString()}
          </Text>
        </View>
        {mostSpent ? (
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>
              Top Category
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mostSpent.label}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          By Category
        </Text>
        {categoryTotals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No expenses to summarize
            </Text>
          </View>
        ) : (
          categoryTotals.map((cat) => (
            <View
              key={cat.value}
              style={[styles.catRow, { backgroundColor: colors.card }]}
            >
              <View style={styles.catHeader}>
                <View style={styles.catNameRow}>
                  <View style={[styles.dot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.catName, { color: colors.text }]}>
                    {cat.label}
                  </Text>
                </View>
                <View style={styles.catAmountRow}>
                  <Text style={[styles.catAmount, { color: colors.text }]}>
                    {"Rs " + cat.total.toLocaleString()}
                  </Text>
                  <Text style={[styles.catPercent, { color: colors.subtext }]}>
                    {(total > 0 ? Math.round((cat.total / total) * 100) : 0) +
                      "%"}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.barTrack, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      width: (cat.total / maxAmount) * 100 + "%",
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    paddingTop: 55,
  },
  backBtn: { color: "#aaa", fontSize: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  statsRow: { flexDirection: "row", gap: 10, padding: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, elevation: 1 },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  section: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 15 },
  catRow: { borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  catNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 14, fontWeight: "600" },
  catAmountRow: { alignItems: "flex-end" },
  catAmount: { fontSize: 14, fontWeight: "700" },
  catPercent: { fontSize: 11, marginTop: 2 },
  barTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  barFill: { height: 8, borderRadius: 4 },
});
