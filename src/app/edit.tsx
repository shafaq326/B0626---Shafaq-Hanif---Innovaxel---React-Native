import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../utils/categories";

export default function EditExpenseScreen() {
  const { expenses, editExpense } = useExpenses();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const expense = expenses.find((e) => e.id === id);

  const [title, setTitle] = useState(expense?.title || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [category, setCategory] = useState(expense?.category || "Food");
  const [date, setDate] = useState(expense?.date || "");
  const [notes, setNotes] = useState(expense?.notes || "");
  const [error, setError] = useState("");

  const isValidDate = (d) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(d)) return false;
    return !isNaN(new Date(d));
  };

  const showError = (msg) => {
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

    editExpense(id, {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      notes: notes.trim(),
    });
    router.back();
  };

  if (!expense) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Expense not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.goBack}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Expense</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dinner with friends"
          placeholderTextColor="#bbb"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Amount (Rs)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2200"
          placeholderTextColor="#bbb"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.catBtn,
                category === cat.value && {
                  backgroundColor: cat.color,
                  borderColor: cat.color,
                },
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.catText,
                  category === cat.value && { color: "#fff" },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-06-09"
          placeholderTextColor="#bbb"
          value={date}
          onChangeText={setDate}
          maxLength={10}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any additional details..."
          placeholderTextColor="#bbb"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  notFoundText: { fontSize: 16, color: "#555" },
  goBack: { fontSize: 15, color: "#2C2C54", fontWeight: "600" },
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
    color: "#555",
    marginBottom: 8,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#1a1a1a",
    elevation: 1,
  },
  notesInput: { height: 90, textAlignVertical: "top" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  catText: { fontSize: 13, fontWeight: "600", color: "#555" },
  submitBtn: {
    backgroundColor: "#2C2C54",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 36,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
