import { Platform } from "react-native";

export const colors = {
  backgroundPrimary: "#F5F1EA",
  backgroundSecondary: "#EAE4DA",
  textPrimary: "#1C1C1A",
  accentPrimary: "#C46A3A",
  accentSecondary: "#7A8A6B",
  subtleBorder: "#D6CEC2",
  mutedText: "#6B6B68",
  ink: "#111110",
  ivory: "#FBF8F2",
  paperDeep: "#EFE8DE",
  taupe: "#8B7357",
  danger: "#8E3F2F",
  blue: "#476A9B",
  white: "#FFFFFF"
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 28,
  pill: 999
};

export const typography = {
  serif: "PlayfairDisplay_400Regular",
  serifSemibold: "PlayfairDisplay_600SemiBold",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace"
  })
};

export const shadows = {
  soft: Platform.select({
    web: { boxShadow: "0 12px 24px rgba(111, 98, 83, 0.12)" },
    default: {
      shadowColor: "#6F6253",
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 5
    }
  }) as Record<string, unknown>,
  light: Platform.select({
    web: { boxShadow: "0 8px 14px rgba(111, 98, 83, 0.08)" },
    default: {
      shadowColor: "#6F6253",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2
    }
  }) as Record<string, unknown>
};
