import { useRouter } from "expo-router";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import PressableButton from "../components/PressableButton";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useExpenseFilter } from "../hooks/useExpenseFilter";
import { CATEGORIES, getCategoryColor } from "../utils/categories";

export default function HomeScreen() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { colors, dark, toggle } = useTheme();
  const router = useRouter();

  const {
    selectedCategory,
    setSelectedCategory,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    showFilters,
    setShowFilters,
    filtered,
    hasActiveFilters,
    clearFilters,
  } = useExpenseFilter(expenses);

  const { handleDelete } = useDeleteExpense(deleteExpense);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const filteredTotal = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.subtext, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View>
          <Text style={styles.headerLabel}>Total Spent</Text>
          <Text style={styles.headerAmount}>
            {"Rs " + totalSpent.toLocaleString()}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              hasActiveFilters ? styles.headerBtnActive : null,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text
              style={[
                styles.headerBtnText,
                hasActiveFilters ? { color: colors.header } : null,
              ]}
            >
              {hasActiveFilters ? "Filtered" : "Filter"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={toggle}>
            <Text style={styles.headerBtnText}>{dark ? "Light" : "Dark"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.push("/summary")}
          >
            <Text style={styles.headerBtnText}>Summary</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showFilters ? (
        <View
          style={[
            styles.filterPanel,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.filterPanelHeader}>
            <Text style={[styles.filterPanelTitle, { color: colors.text }]}>
              Filters
            </Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.filterCloseBtn, { color: colors.subtext }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.filterLabel, { color: colors.subtext }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            <TouchableOpacity
              style={[
                styles.catChip,
                { borderColor: colors.border },
                !selectedCategory
                  ? {
                      backgroundColor: colors.accent,
                      borderColor: colors.accent,
                    }
                  : null,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.catChipText,
                  { color: colors.subtext },
                  !selectedCategory ? { color: "#fff" } : null,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.catChip,
                  { borderColor: colors.border },
                  selectedCategory === cat.value
                    ? { backgroundColor: cat.color, borderColor: cat.color }
                    : null,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === cat.value ? null : cat.value,
                  )
                }
              >
                <Text
                  style={[
                    styles.catChipText,
                    { color: colors.subtext },
                    selectedCategory === cat.value ? { color: "#fff" } : null,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.filterLabel, { color: colors.subtext }]}>
            Date Range
          </Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="From YYYY-MM-DD"
              placeholderTextColor={colors.subtext}
              value={fromDate}
              onChangeText={setFromDate}
              maxLength={10}
              keyboardType="numeric"
            />
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="To YYYY-MM-DD"
              placeholderTextColor={colors.subtext}
              value={toDate}
              onChangeText={setToDate}
              maxLength={10}
              keyboardType="numeric"
            />
          </View>
          {hasActiveFilters ? (
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {hasActiveFilters ? (
        <View
          style={[styles.resultsBar, { backgroundColor: colors.resultsBg }]}
        >
          <Text style={[styles.resultsText, { color: colors.subtext }]}>
            {filtered.length + (filtered.length !== 1 ? " results" : " result")}
          </Text>
          <Text style={[styles.resultsTotal, { color: colors.accent }]}>
            {"Rs " + filteredTotal.toLocaleString()}
          </Text>
        </View>
      ) : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyContainer : { paddingBottom: 100 }
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.subtext }]}>
              {hasActiveFilters
                ? "No expenses match your filters"
                : "No expenses yet"}
            </Text>
            <Text style={[styles.emptySubText, { color: colors.subtext }]}>
              {hasActiveFilters
                ? "Try changing or clearing the filters"
                : "Tap + to add your first expense"}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <AnimatedCard index={index}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View
                style={[
                  styles.categoryTag,
                  { backgroundColor: getCategoryColor(item.category) },
                ]}
              />
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.cardMeta, { color: colors.subtext }]}>
                  {item.category + " \u2022 " + item.date}
                </Text>
                {item.notes ? (
                  <Text style={[styles.cardNotes, { color: colors.subtext }]}>
                    {item.notes}
                  </Text>
                ) : null}
              </View>
              <View style={styles.cardRight}>
                <Text style={[styles.cardAmount, { color: colors.accent }]}>
                  {"Rs " + Number(item.amount).toLocaleString()}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.editBtn, { borderColor: colors.accent }]}
                    onPress={() =>
                      router.push({
                        pathname: "/edit",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text
                      style={[styles.editBtnText, { color: colors.accent }]}
                    >
                      Edit
                    </Text>
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
          </AnimatedCard>
        )}
      />
      <PressableButton
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.fabText}>+</Text>
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLabel: { color: "#aaa", fontSize: 13, marginBottom: 4 },
  headerAmount: { color: "#fff", fontSize: 34, fontWeight: "700" },
  headerRight: { flexDirection: "row", gap: 8, alignItems: "center" },
  headerBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  headerBtnActive: { backgroundColor: "#fff", borderColor: "#fff" },
  headerBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  filterPanel: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  filterPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterPanelTitle: { fontSize: 15, fontWeight: "700" },
  filterCloseBtn: { fontSize: 14, fontWeight: "600" },
  filterLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  categoryScroll: { marginBottom: 4 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  catChipText: { fontSize: 13, fontWeight: "600" },
  dateRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  dateInput: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    borderWidth: 1,
  },
  clearBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FFE8E8",
  },
  clearBtnText: { fontSize: 13, color: "#E8604C", fontWeight: "600" },
  resultsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsText: { fontSize: 13 },
  resultsTotal: { fontSize: 13, fontWeight: "700" },
  emptyContainer: { flex: 1, justifyContent: "center" },
  empty: { alignItems: "center", marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
  emptySubText: { fontSize: 14, marginTop: 6 },
  card: {
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
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardMeta: { fontSize: 12, marginTop: 3 },
  cardNotes: { fontSize: 12, marginTop: 3 },
  cardRight: {
    padding: 14,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardAmount: { fontSize: 15, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 8, marginTop: 8 },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 12, fontWeight: "600" },
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
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "300", lineHeight: 32 },
});
