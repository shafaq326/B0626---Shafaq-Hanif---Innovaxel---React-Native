import { useState } from "react";
import { Expense } from "../types/expense";

export function useExpenseFilter(expenses: Expense[]) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const isValidDate = (d: string) => {
    const normalized = normalizeDate(d);
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(normalized)) return false;
    return !isNaN(new Date(normalized).getTime());
  };

  const normalizeDate = (d: string): string => {
    const parts = d.split("-");
    if (parts.length !== 3) return d;
    const [y, m, day] = parts;
    return `${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const filtered = [...expenses]
    .filter((e) => {
      if (selectedCategory && e.category !== selectedCategory) return false;
      const expDate = normalizeDate(e.date);
      if (
        fromDate &&
        isValidDate(fromDate) &&
        expDate < normalizeDate(fromDate)
      )
        return false;
      if (toDate && isValidDate(toDate) && expDate > normalizeDate(toDate))
        return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasActiveFilters = !!(selectedCategory || fromDate || toDate);

  const clearFilters = () => {
    setSelectedCategory(null);
    setFromDate("");
    setToDate("");
  };

  return {
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
  };
}
