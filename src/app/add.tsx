import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PressableButton from "../components/PressableButton";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES } from "../utils/categories";

export default function AddExpenseScreen() {
  const { addExpense } = useExpenses();
  const { colors } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const isValidDate = (d: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(d)) return false;
    return !isNaN(new Date(d).getTime());
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const handleSubmit = () => {
    if (!title.trim()) return showError("Title cannot be empty");
    if (!amount.trim()) return showError("Amount cannot be empty");
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return showError("Amount must be a valid positive number");
    if (!isValidDate(date))
      return showError("Enter a valid date in YYYY-MM-DD format");

    addExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      notes: notes.trim(),
    });
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
      </View>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.subtext }]}>Title</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="e.g. Dinner with friends"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={[styles.label, { color: colors.subtext }]}>
          Amount (Rs)
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="e.g. 2200"
          placeholderTextColor={colors.subtext}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={[styles.label, { color: colors.subtext }]}>Category</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.catBtn,
                { borderColor: colors.border, backgroundColor: colors.card },
                category === cat.value
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : null,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.catText,
                  { color: colors.subtext },
                  category === cat.value ? { color: "#fff" } : null,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Date (YYYY-MM-DD)
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="e.g. 2026-06-09"
          placeholderTextColor={colors.subtext}
          value={date}
          onChangeText={setDate}
          maxLength={10}
          keyboardType="numeric"
        />
        <Text style={[styles.label, { color: colors.subtext }]}>
          Notes (optional)
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.notesInput,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Any additional details..."
          placeholderTextColor={colors.subtext}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <PressableButton
          style={[styles.submitBtn, { backgroundColor: colors.accent }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Save Expense</Text>
        </PressableButton>
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
  errorBox: {
    backgroundColor: "#E8604C",
    margin: 16,
    padding: 14,
    borderRadius: 10,
  },
  errorText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  form: { padding: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: { borderRadius: 10, padding: 14, fontSize: 15, elevation: 1 },
  notesInput: { height: 90, textAlignVertical: "top" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  catText: { fontSize: 13, fontWeight: "600" },
  submitBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 36,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
