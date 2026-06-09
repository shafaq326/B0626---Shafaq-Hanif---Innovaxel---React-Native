import { Stack } from "expo-router";
import { ExpenseProvider } from "../context/ExpenseContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: false }} />
          <Stack.Screen name="edit" options={{ headerShown: false }} />
          <Stack.Screen name="summary" options={{ headerShown: false }} />
        </Stack>
      </ExpenseProvider>
    </ThemeProvider>
  );
}
