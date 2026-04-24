import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { AppText } from "@/components/Text";
import { colors, radius, spacing } from "@/theme/tokens";

type PrimaryButtonProps = PropsWithChildren<{
  onPress?: () => void;
  variant?: "dark" | "soft" | "ghost";
  style?: ViewStyle;
}>;

export function PrimaryButton({ children, onPress, variant = "soft", style }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}>
      <AppText variant="button" style={variant === "dark" && styles.darkText}>
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill
  },
  soft: {
    backgroundColor: colors.paperDeep
  },
  dark: {
    backgroundColor: colors.ink
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.subtleBorder
  },
  darkText: {
    color: colors.ivory
  },
  pressed: {
    opacity: 0.72
  }
});
