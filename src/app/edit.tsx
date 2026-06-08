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
    const parsed = new Date(d);
    return parsed instanceof Date && !isNaN(parsed);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const handleSubmit = () => {
    if (!title.trim()) return showError("❌ Title cannot be empty");

    if (!amount.trim()) return showError("❌ Amount cannot be empty");

    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return showError("❌ Amount must be a valid positive number");

    if (!isValidDate(date))
      return showError("❌ Please enter a valid date in YYYY-MM-DD format");

    editExpense(id, {
      title,
      amount: Number(amount),
      category,
      date,
      notes,
    });

    router.back();
  };

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Expense</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dinner with friends"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Amount (Rs) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2200"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category *</Text>
        <View style={styles.categories}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.catBtn,
                {
                  backgroundColor:
                    category === cat.value ? cat.color : "#f0f0f0",
                },
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={styles.catText}>
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-06-08"
          value={date}
          onChangeText={setDate}
          maxLength={10}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any additional notes..."
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
  errorBox: {
    backgroundColor: "#FF6B6B",
    margin: 16,
    padding: 14,
    borderRadius: 12,
  },
  errorText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  form: { padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    elevation: 1,
  },
  notesInput: { height: 100, textAlignVertical: "top" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  catText: { fontSize: 13, fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
