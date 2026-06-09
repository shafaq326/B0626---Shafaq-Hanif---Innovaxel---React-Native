export const CATEGORIES = [
  { label: "Food", value: "Food", color: "#E8604C" },
  { label: "Transport", value: "Transport", color: "#3D9BE9" },
  { label: "Utilities", value: "Utilities", color: "#F5A623" },
  { label: "Shopping", value: "Shopping", color: "#7B68EE" },
  { label: "Health", value: "Health", color: "#2ECC71" },
  { label: "Entertainment", value: "Entertainment", color: "#E91E8C" },
  { label: "Education", value: "Education", color: "#00BCD4" },
  { label: "Other", value: "Other", color: "#90A4AE" },
];

export const getCategoryColor = (value) => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? cat.color : "#90A4AE";
};
