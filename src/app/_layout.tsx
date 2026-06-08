import { Stack } from "expo-router";
import { ExpenseProvider } from "../context/ExpenseContext";

export default function Layout() {
  return (
    <ExpenseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: false }} />
        <Stack.Screen name="edit" options={{ headerShown: false }} />
        <Stack.Screen name="summary" options={{ headerShown: false }} />
      </Stack>
    </ExpenseProvider>
  );
}
