import { createContext, useContext, useEffect, useState } from "react";
import { loadExpenses, saveExpenses } from "../utils/storage";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses().then(setExpenses);
  }, []);

  const addExpense = async (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString().split("T")[0],
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    await saveExpenses(updated);
  };

  const editExpense = async (id, updatedExpense) => {
    const updated = expenses.map((e) =>
      e.id === id ? { ...e, ...updatedExpense } : e,
    );
    setExpenses(updated);
    await saveExpenses(updated);
  };

  const deleteExpense = async (id) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    await saveExpenses(updated);
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, editExpense, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
