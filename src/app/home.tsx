import { useRouter } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../utils/categories";

export default function HomeScreen() {
  const { expenses, deleteExpense } = useExpenses();
  const router = useRouter();

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const getCategoryColor = (cat) => {
    const found = CATEGORIES.find((c) => c.value === cat);
    return found ? found.color : "#B0B0B0";
  };

  const getCategoryIcon = (cat) => {
    const found = CATEGORIES.find((c) => c.value === cat);
    return found ? found.icon : "📦";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Expense Tracker</Text>
        <TouchableOpacity
          style={styles.summaryBtn}
          onPress={() => router.push("/summary")}
        >
          <Text style={styles.summaryBtnText}>📊 Summary</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No expenses yet!</Text>
            <Text style={styles.emptySubText}>
              Tap + to add your first expense
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { borderLeftColor: getCategoryColor(item.category) },
            ]}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>
                {getCategoryIcon(item.category)}
              </Text>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCategory}>
                  {item.category} • {item.date}
                </Text>
                {item.notes ? (
                  <Text style={styles.cardNotes}>{item.notes}</Text>
                ) : null}
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardAmount}>Rs {item.amount}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/edit", params: { id: item.id } })
                  }
                >
                  <Text style={styles.editBtn}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#6C63FF",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  summaryBtn: { backgroundColor: "#fff", padding: 8, borderRadius: 20 },
  summaryBtnText: { color: "#6C63FF", fontWeight: "bold" },
  empty: { alignItems: "center", marginTop: 100 },
  emptyText: { fontSize: 20, color: "#aaa", fontWeight: "bold" },
  emptySubText: { fontSize: 14, color: "#ccc", marginTop: 8 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderLeftWidth: 5,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  cardIcon: { fontSize: 30 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardCategory: { fontSize: 12, color: "#888", marginTop: 2 },
  cardNotes: { fontSize: 11, color: "#aaa", marginTop: 2 },
  cardRight: { alignItems: "flex-end" },
  cardAmount: { fontSize: 16, fontWeight: "bold", color: "#6C63FF" },
  actions: { flexDirection: "row", gap: 8, marginTop: 8 },
  editBtn: { fontSize: 18 },
  deleteBtn: { fontSize: 18 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6C63FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
});
