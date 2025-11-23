export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
}

export interface AppTheme {
  colors: ThemeColors;
}

export const theme: AppTheme = {
  colors: {
    primary: "#5A7DFE",
    secondary: "#A78BFA",
    accent: "#34D399",
    background: "#F7F8FA",
    card: "#FFFFFF",
    border: "#E5E7EB",
    text: "#1F2937",
    textSecondary: "#6B7280",
    success: "#10B981",
    warning: "#FBBF24",
    error: "#EF4444"
  }
};
