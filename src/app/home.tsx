import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { getCategoryColor } from "../utils/categories";

export default function HomeScreen() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const router = useRouter();

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this expense?")) {
        deleteExpense(id);
      }
    } else {
      Alert.alert(
        "Delete Expense",
        "Are you sure you want to delete this expense?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteExpense(id),
          },
        ],
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Total Spent</Text>
          <Text style={styles.headerAmount}>
            Rs {totalSpent.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.summaryBtn}
          onPress={() => router.push("/summary")}
        >
          <Text style={styles.summaryBtnText}>Summary</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={sorted.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptySubText}>
              Tap + to add your first expense
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.category} • {item.date}
              </Text>
              {item.notes ? (
                <Text style={styles.cardNotes}>{item.notes}</Text>
              ) : null}
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardAmount}>
                Rs {Number(item.amount).toLocaleString()}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    router.push({ pathname: "/edit", params: { id: item.id } })
                  }
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#999", fontSize: 16 },

  header: {
    backgroundColor: "#2C2C54",
    paddingTop: 55,
    paddingBottom: 28,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLabel: { color: "#aaa", fontSize: 13, marginBottom: 4 },
  headerAmount: { color: "#fff", fontSize: 34, fontWeight: "700" },
  summaryBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  summaryBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  emptyContainer: { flex: 1, justifyContent: "center" },
  empty: { alignItems: "center", marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#555" },
  emptySubText: { fontSize: 14, color: "#aaa", marginTop: 6 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "stretch",
    overflow: "hidden",
    elevation: 1,
  },
  categoryTag: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  cardMeta: { fontSize: 12, color: "#999", marginTop: 3 },
  cardNotes: { fontSize: 12, color: "#bbb", marginTop: 3 },
  cardRight: {
    padding: 14,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardAmount: { fontSize: 15, fontWeight: "700", color: "#2C2C54" },
  actions: { flexDirection: "row", gap: 8, marginTop: 8 },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#2C2C54",
  },
  editBtnText: { fontSize: 12, color: "#2C2C54", fontWeight: "600" },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFE8E8",
  },
  deleteBtnText: { fontSize: 12, color: "#E8604C", fontWeight: "600" },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#2C2C54",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "300", lineHeight: 32 },
});
