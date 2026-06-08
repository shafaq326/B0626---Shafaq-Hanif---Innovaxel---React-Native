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
  }).filter((cat) => cat.total > 0);

  const maxAmount = Math.max(...categoryTotals.map((c) => c.total), 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 Summary</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>Rs {total.toLocaleString()}</Text>
        <Text style={styles.totalCount}>{expenses.length} expenses</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categoryTotals.length === 0 ? (
          <Text style={styles.noData}>No expenses yet!</Text>
        ) : (
          categoryTotals.map((cat) => (
            <View key={cat.value} style={styles.catRow}>
              <View style={styles.catInfo}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <View>
                  <Text style={styles.catName}>{cat.label}</Text>
                  <Text style={styles.catAmount}>
                    Rs {cat.total.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${(cat.total / maxAmount) * 100}%`,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.catPercent}>
                {total > 0 ? Math.round((cat.total / total) * 100) : 0}%
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#6C63FF",
    gap: 16,
  },
  backBtn: { color: "#fff", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  totalCard: {
    backgroundColor: "#6C63FF",
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  totalLabel: { color: "#fff", fontSize: 16, opacity: 0.8 },
  totalAmount: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 8,
  },
  totalCount: { color: "#fff", fontSize: 14, opacity: 0.7, marginTop: 4 },
  section: { margin: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  noData: { color: "#aaa", textAlign: "center", marginTop: 20 },
  catRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  catInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  catIcon: { fontSize: 28 },
  catName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  catAmount: { fontSize: 14, color: "#666", marginTop: 2 },
  barContainer: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  bar: { height: 10, borderRadius: 5 },
  catPercent: { fontSize: 12, color: "#888", marginTop: 6, textAlign: "right" },
});
