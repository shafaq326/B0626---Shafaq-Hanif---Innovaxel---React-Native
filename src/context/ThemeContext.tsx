import React, { createContext, useContext, useState } from "react";

type Theme = {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    header: string;
    text: string;
    subtext: string;
    border: string;
    inputBg: string;
    accent: string;
    resultsBg: string;
  };
  toggle: () => void;
};

const lightColors = {
  background: "#F7F8FA",
  card: "#ffffff",
  header: "#2C2C54",
  text: "#1a1a1a",
  subtext: "#999999",
  border: "#eeeeee",
  inputBg: "#F7F8FA",
  accent: "#2C2C54",
  resultsBg: "#EEEEF5",
};

const darkColors = {
  background: "#0F0F0F",
  card: "#1C1C1E",
  header: "#161628",
  text: "#F2F2F7",
  subtext: "#AEAEB2",
  border: "#38383A",
  inputBg: "#2C2C2E",
  accent: "#9D99FF",
  resultsBg: "#1C1C2E",
};

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState(false);

  const toggle = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ dark, colors: dark ? darkColors : lightColors, toggle }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
