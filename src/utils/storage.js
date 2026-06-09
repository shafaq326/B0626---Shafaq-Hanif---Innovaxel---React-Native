import AsyncStorage from "@react-native-async-storage/async-storage";

const EXPENSES_KEY = "@expenses";

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error("Error saving expenses:", e);
  }
};

export const loadExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading expenses:", e);
    return [];
  }
};
