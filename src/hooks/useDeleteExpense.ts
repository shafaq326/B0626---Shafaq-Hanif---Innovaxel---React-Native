import { Alert, Platform } from "react-native";

export function useDeleteExpense(deleteExpense: (id: string) => void) {
  const handleDelete = (id: string) => {
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

  return { handleDelete };
}
